const User = require('../models/User');
const Relationship = require('../models/Relationship');
const Post = require('../models/Post');
const Interaction = require('../models/Interaction');
const UserInterest = require('../models/UserInterest');

const RECOMMENDATION_WEIGHTS = {
  MUTUAL_CONNECTIONS: 0.4,
  SIMILAR_INTERESTS: 0.3,
  CONTENT_CREATORS: 0.3
};
const INTERACTION_DAYS = 30;

/**
 * To Generate personalized "People You May Know" recommendations
 * @param {String} userId 
 * @param {Number} limit 
 * @returns {Promise<Array>}
 */
exports.getPeopleYouMayKnow = async function(userId, limit = 20) {
  try {
    const [followingIds, userInteractions, userInterestData] = await Promise.all([
      getFollowingIds(userId),
      getUserInteractions(userId),
      UserInterest.findOne({ user: userId }).lean()
    ]);

    const [mutualConnections, similarInterestUsers, interactedWithUserIds] = await Promise.all([
      findMutualConnections(userId, followingIds),
      findSimilarInterestUsers(userId, followingIds, userInterestData, userInteractions),
      extractInteractedUserIds(userInteractions)
    ]);

    const recommendations = generateRecommendations(
      mutualConnections,
      similarInterestUsers,
      interactedWithUserIds,
      followingIds,
      userId,
      limit
    );

    return await getFullUserData(recommendations, limit);

  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};


async function getFollowingIds(userId) {
  const relationships = await Relationship.find({
    follower: userId,
    status: { $in: ['accepted', 'pending'] }
  }).lean();
  return relationships.map(r => r.following.toString());
}

async function getUserInteractions(userId) {
  const dateThreshold = new Date();
  dateThreshold.setDate(dateThreshold.getDate() - INTERACTION_DAYS);

  return Interaction.find({
    user: userId,
    interactionType: { $in: ['like', 'comment', 'view'] },
    createdAt: { $gte: dateThreshold }
  }).populate({
    path: 'post',
    select: 'user tags',
    options: { lean: true }
  }).lean();
}

async function findMutualConnections(userId, followingIds) {
  return Relationship.aggregate([
    { $match: { follower: userId, status: 'accepted' } },
    {
      $lookup: {
        from: 'relationships',
        let: { followingId: '$following' },
        pipeline: [
          { $match: { $expr: { $eq: ['$follower', '$$followingId'] }, status: 'accepted' } }
        ],
        as: 'secondDegreeConnections'
      }
    },
    { $unwind: '$secondDegreeConnections' },
    {
      $group: {
        _id: '$secondDegreeConnections.following',
        mutualCount: { $sum: 1 },
        connections: { $addToSet: '$following' }
      }
    },
    { $match: { _id: { $nin: [...followingIds, userId] } } },
    { $sort: { mutualCount: -1 } },
    { $limit: 100 }
  ]);
}

async function findSimilarInterestUsers(userId, followingIds, userInterestData, userInteractions) {
  const userInterests = userInterestData?.interests?.map(i => i.category) || 
    extractInterestsFromInteractions(userInteractions);

  if (userInterests.length === 0) return [];

  return UserInterest.aggregate([
    {
      $match: {
        user: { $ne: userId, $nin: followingIds },
        'interests.category': { $in: userInterests }
      }
    },
    { $unwind: '$interests' },
    { $match: { 'interests.category': { $in: userInterests } } },
    {
      $group: {
        _id: '$user',
        interestScore: { $sum: '$interests.weight' },
        commonInterests: { $addToSet: '$interests.category' }
      }
    },
    { $sort: { interestScore: -1 } },
    { $limit: 50 }
  ]);
}

function extractInterestsFromInteractions(interactions) {
  const tags = interactions
    .filter(i => i.post?.tags)
    .flatMap(i => i.post.tags);

  return Object.entries(
    tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {})
  )
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([tag]) => tag);
}

function extractInteractedUserIds(interactions) {
  return [
    ...new Set(
      interactions
        .filter(i => i.post?.user)
        .map(i => i.post.user.toString())
    )
  ];
}

function generateRecommendations(mutualConnections, similarInterestUsers, interactedWithUserIds, followingIds, userId, limit) {
  const recommendationSources = [
    ...mutualConnections.map(conn => ({
      userId: conn._id.toString(),
      score: RECOMMENDATION_WEIGHTS.MUTUAL_CONNECTIONS * Math.min(conn.mutualCount / 10, 1),
      reason: 'mutual_connections'
    })),
    ...similarInterestUsers.map(user => ({
      userId: user._id.toString(),
      score: RECOMMENDATION_WEIGHTS.SIMILAR_INTERESTS * Math.min(user.interestScore / 5, 1),
      reason: 'similar_interests'
    })),
    ...interactedWithUserIds
      .filter(id => !followingIds.includes(id) && id !== userId)
      .map(id => ({
        userId: id,
        score: RECOMMENDATION_WEIGHTS.CONTENT_CREATORS,
        reason: 'content_creator'
      }))
  ];

  const scoredUsers = recommendationSources.reduce((acc, rec) => {
    acc[rec.userId] = acc[rec.userId] || { userId: rec.userId, score: 0, reasons: new Set() };
    acc[rec.userId].score += rec.score;
    acc[rec.userId].reasons.add(rec.reason);
    return acc;
  }, {});

  return Object.values(scoredUsers)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function getFullUserData(recommendations, limit) {
  const userIds = recommendations.map(r => r.userId);
  const users = await User.find(
    { _id: { $in: userIds } },
    'username name profilePicture bio followersCount postsCount'
  ).lean();

  const userMap = users.reduce((acc, user) => {
    acc[user._id.toString()] = user;
    return acc;
  }, {});

  return recommendations
    .filter(r => userMap[r.userId])
    .map(r => ({
      user: userMap[r.userId],
      score: parseFloat(r.score.toFixed(2)),
      reasons: Array.from(r.reasons)
    }));
}

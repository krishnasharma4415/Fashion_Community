const express = require("express");
const auth = require("../middleware/auth");
const Recommendation = require("../models/Recommendation");
const User = require("../models/User");
const Follow = require("../models/Follow");

const router = express.Router();

// Get post recommendations
router.get("/", auth, async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ userId: req.user.id }).populate("postId");
        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// Get people you may know (user suggestions)
router.get("/users", auth, async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;

        // Get users that current user is already following
        const followingUsers = await Follow.find({ follower: currentUserId }).select('following');
        const followingIds = followingUsers.map(f => f.following.toString());
        
        // Add current user to exclude list
        const excludeIds = [...followingIds, currentUserId];

        // Find users not being followed, excluding current user
        const suggestedUsers = await User.find({
            _id: { $nin: excludeIds }
        })
        .select('username email profilePicture bio')
        .limit(limit);

        // For each suggested user, get mutual connections info
        const suggestions = await Promise.all(
            suggestedUsers.map(async (user) => {
                // Find mutual connections
                const mutualFollows = await Follow.find({
                    follower: { $in: followingIds },
                    following: user._id
                }).populate('follower', 'username');

                const mutualCount = mutualFollows.length;
                const mutualNames = mutualFollows.slice(0, 2).map(f => f.follower.username);

                let followedByText = '';
                if (mutualCount > 0) {
                    if (mutualCount === 1) {
                        followedByText = `Followed by ${mutualNames[0]}`;
                    } else if (mutualCount === 2) {
                        followedByText = `Followed by ${mutualNames[0]} and ${mutualNames[1]}`;
                    } else {
                        followedByText = `Followed by ${mutualNames[0]} and ${mutualCount - 1} others`;
                    }
                } else {
                    followedByText = 'Suggested for you';
                }

                return {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                    mutualCount,
                    followedBy: followedByText
                };
            })
        );

        // Sort by mutual connections count (descending)
        suggestions.sort((a, b) => b.mutualCount - a.mutualCount);

        res.json({
            success: true,
            count: suggestions.length,
            data: suggestions
        });
    } catch (err) {
        console.error("Error getting user suggestions:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

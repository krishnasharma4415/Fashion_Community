const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');
require('dotenv').config();

async function testCounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Testing all counts across the application...\n');

    // Test 1: Post counts vs actual posts
    console.log('📊 Testing Post Counts:');
    const posts = await Post.find({}).populate('userId', 'username');
    
    for (const post of posts) {
      const actualLikes = await Like.countDocuments({ postId: post._id });
      const actualComments = await Comment.countDocuments({ postId: post._id });
      
      console.log(`Post by ${post.userId.username}:`);
      console.log(`  📝 Caption: "${post.caption.substring(0, 40)}..."`);
      console.log(`  ❤️  Likes: ${post.likeCount} (stored) vs ${actualLikes} (actual) ${post.likeCount === actualLikes ? '✅' : '❌'}`);
      console.log(`  💬 Comments: ${post.commentCount} (stored) vs ${actualComments} (actual) ${post.commentCount === actualComments ? '✅' : '❌'}`);
      console.log('');
    }

    // Test 2: User stats
    console.log('👥 Testing User Stats:');
    const users = await User.find({}).select('username');
    
    for (const user of users) {
      const actualPosts = await Post.countDocuments({ userId: user._id });
      const actualFollowers = await Follow.countDocuments({ following: user._id });
      const actualFollowing = await Follow.countDocuments({ follower: user._id });
      
      console.log(`User: ${user.username}`);
      console.log(`  📝 Posts: ${actualPosts}`);
      console.log(`  👥 Followers: ${actualFollowers}`);
      console.log(`  👤 Following: ${actualFollowing}`);
      console.log('');
    }

    // Test 3: Overall system stats
    console.log('🌐 System-wide Stats:');
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalLikes = await Like.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalFollows = await Follow.countDocuments();
    
    console.log(`  👥 Total Users: ${totalUsers}`);
    console.log(`  📝 Total Posts: ${totalPosts}`);
    console.log(`  ❤️  Total Likes: ${totalLikes}`);
    console.log(`  💬 Total Comments: ${totalComments}`);
    console.log(`  🔗 Total Follows: ${totalFollows}`);

    // Test 4: Check for inconsistencies
    console.log('\n🔍 Checking for inconsistencies:');
    let inconsistencies = 0;
    
    for (const post of posts) {
      const actualLikes = await Like.countDocuments({ postId: post._id });
      const actualComments = await Comment.countDocuments({ postId: post._id });
      
      if (post.likeCount !== actualLikes) {
        console.log(`❌ Post ${post._id}: Like count mismatch (${post.likeCount} vs ${actualLikes})`);
        inconsistencies++;
      }
      
      if (post.commentCount !== actualComments) {
        console.log(`❌ Post ${post._id}: Comment count mismatch (${post.commentCount} vs ${actualComments})`);
        inconsistencies++;
      }
    }
    
    if (inconsistencies === 0) {
      console.log('✅ All counts are consistent!');
    } else {
      console.log(`❌ Found ${inconsistencies} inconsistencies`);
    }

    console.log('\n🎉 Count testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing counts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the test function
testCounts();
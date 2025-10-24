const mongoose = require('mongoose');
const Post = require('../models/Post');
const Like = require('../models/Like');
require('dotenv').config();

async function fixLikeCounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 Fixing like counts...');

    // Get all posts
    const posts = await Post.find({});
    console.log(`📊 Found ${posts.length} posts to fix`);

    let updatedCount = 0;

    for (const post of posts) {
      // Count actual likes for this post
      const actualLikeCount = await Like.countDocuments({ postId: post._id });
      
      // Update the post's like count to match actual likes
      if (post.likeCount !== actualLikeCount) {
        await Post.findByIdAndUpdate(post._id, { 
          likeCount: actualLikeCount,
          commentCount: 0 // Also reset comment count to 0 since we don't have real comments
        });
        
        console.log(`✅ Updated post ${post._id}: ${post.likeCount} → ${actualLikeCount} likes`);
        updatedCount++;
      } else {
        console.log(`✓ Post ${post._id} already has correct like count: ${actualLikeCount}`);
      }
    }

    console.log(`\n🎉 Fixed ${updatedCount} posts!`);
    console.log('📊 Summary:');
    console.log(`   • Total posts checked: ${posts.length}`);
    console.log(`   • Posts updated: ${updatedCount}`);
    console.log(`   • Posts already correct: ${posts.length - updatedCount}`);
    console.log('\n✅ All like counts are now accurate based on actual Like documents');
    
  } catch (error) {
    console.error('❌ Error fixing like counts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the fix function
fixLikeCounts();
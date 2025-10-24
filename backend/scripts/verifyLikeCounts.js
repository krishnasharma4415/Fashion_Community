const mongoose = require('mongoose');
const Post = require('../models/Post');
const Like = require('../models/Like');
const User = require('../models/User');
require('dotenv').config();

async function verifyLikeCounts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    console.log('\n🔍 Verifying like counts...');

    // Get all posts
    const posts = await Post.find({}).populate('userId', 'username');
    console.log(`📊 Checking ${posts.length} posts`);

    let correctCount = 0;
    let incorrectCount = 0;

    for (const post of posts) {
      // Count actual likes for this post
      const actualLikeCount = await Like.countDocuments({ postId: post._id });
      
      if (post.likeCount === actualLikeCount) {
        console.log(`✅ ${post.userId.username}: "${post.caption.substring(0, 30)}..." - ${post.likeCount} likes (correct)`);
        correctCount++;
      } else {
        console.log(`❌ ${post.userId.username}: "${post.caption.substring(0, 30)}..." - Post shows ${post.likeCount}, actual ${actualLikeCount} likes`);
        incorrectCount++;
      }
    }

    console.log(`\n📊 Verification Summary:`);
    console.log(`   ✅ Correct like counts: ${correctCount}`);
    console.log(`   ❌ Incorrect like counts: ${incorrectCount}`);
    console.log(`   📈 Total posts: ${posts.length}`);
    
    if (incorrectCount === 0) {
      console.log('\n🎉 All like counts are accurate!');
    } else {
      console.log('\n⚠️  Some like counts need fixing. Run fixLikeCounts.js to fix them.');
    }
    
  } catch (error) {
    console.error('❌ Error verifying like counts:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

// Run the verification function
verifyLikeCounts();
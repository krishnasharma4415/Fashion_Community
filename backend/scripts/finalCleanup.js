const mongoose = require('mongoose');
require('dotenv').config();

const Like = require('../models/Like');
const Post = require('../models/Post');

async function finalCleanup() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Delete orphaned likes (likes without corresponding posts)
        const allPosts = await Post.find().select('_id');
        const postIds = allPosts.map(post => post._id);
        
        const orphanedLikes = await Like.deleteMany({ postId: { $nin: postIds } });
        console.log(`🗑️  Deleted ${orphanedLikes.deletedCount} orphaned likes`);

        console.log('✅ Final cleanup completed!');

    } catch (error) {
        console.error('❌ Error in final cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

finalCleanup();
const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Follow = require('../models/Follow');
const Report = require('../models/Report');

async function cleanDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find the demo user to preserve
        const demoUser = await User.findOne({ email: 'demo@fashion.com' });
        
        if (!demoUser) {
            console.log('❌ Demo user not found! Creating demo user...');
            
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('demo123', 10);
            
            const newDemoUser = new User({
                username: 'demo_user',
                email: 'demo@fashion.com',
                password: hashedPassword,
                role: 'user'
            });
            
            await newDemoUser.save();
            console.log('✅ Demo user created');
            
            // Update demoUser reference
            const createdDemoUser = await User.findOne({ email: 'demo@fashion.com' });
            console.log('📝 Demo user ID:', createdDemoUser._id);
        } else {
            console.log('✅ Demo user found:', demoUser.username);
            console.log('📝 Demo user ID:', demoUser._id);
        }

        // Get the final demo user
        const finalDemoUser = await User.findOne({ email: 'demo@fashion.com' });
        const demoUserId = finalDemoUser._id;

        console.log('\n🗑️  Starting database cleanup...\n');

        // 1. Delete all posts (except demo user's posts)
        const postsResult = await Post.deleteMany({ userId: { $ne: demoUserId } });
        console.log(`🗑️  Deleted ${postsResult.deletedCount} posts (keeping demo user's posts)`);

        // 2. Delete all comments (except those on demo user's posts)
        const demoPosts = await Post.find({ userId: demoUserId }).select('_id');
        const demoPostIds = demoPosts.map(post => post._id);
        
        const commentsResult = await Comment.deleteMany({ 
            $and: [
                { userId: { $ne: demoUserId } },
                { postId: { $nin: demoPostIds } }
            ]
        });
        console.log(`🗑️  Deleted ${commentsResult.deletedCount} comments`);

        // 3. Delete all likes (except demo user's likes and likes on demo posts)
        const likesResult = await Like.deleteMany({ 
            $and: [
                { userId: { $ne: demoUserId } },
                { postId: { $nin: demoPostIds } }
            ]
        });
        console.log(`🗑️  Deleted ${likesResult.deletedCount} likes`);

        // 4. Delete all follows (except those involving demo user)
        const followsResult = await Follow.deleteMany({ 
            $and: [
                { follower: { $ne: demoUserId } },
                { following: { $ne: demoUserId } }
            ]
        });
        console.log(`🗑️  Deleted ${followsResult.deletedCount} follow relationships`);

        // 5. Delete all reports (except those by demo user)
        const reportsResult = await Report.deleteMany({ reporter: { $ne: demoUserId } });
        console.log(`🗑️  Deleted ${reportsResult.deletedCount} reports`);

        // 6. Delete all users except demo user and admin users
        const usersResult = await User.deleteMany({ 
            $and: [
                { _id: { $ne: demoUserId } },
                { email: { $ne: 'admin@fashion.com' } },
                { role: { $ne: 'admin' } }
            ]
        });
        console.log(`🗑️  Deleted ${usersResult.deletedCount} users (keeping demo user and admins)`);

        // 7. Clean up demo user's saved posts (remove references to deleted posts)
        const allRemainingPosts = await Post.find().select('_id');
        const remainingPostIds = allRemainingPosts.map(post => post._id);
        
        await User.updateOne(
            { _id: demoUserId },
            { $pull: { savedPosts: { $nin: remainingPostIds } } }
        );
        console.log(`🧹 Cleaned up demo user's saved posts references`);

        console.log('\n✅ Database cleanup completed successfully!');
        console.log('\n📊 Remaining data:');
        
        // Show remaining counts
        const remainingUsers = await User.countDocuments();
        const remainingPosts = await Post.countDocuments();
        const remainingComments = await Comment.countDocuments();
        const remainingLikes = await Like.countDocuments();
        const remainingFollows = await Follow.countDocuments();
        const remainingReports = await Report.countDocuments();
        
        console.log(`   👥 Users: ${remainingUsers}`);
        console.log(`   📝 Posts: ${remainingPosts}`);
        console.log(`   💬 Comments: ${remainingComments}`);
        console.log(`   ❤️  Likes: ${remainingLikes}`);
        console.log(`   👫 Follows: ${remainingFollows}`);
        console.log(`   🚩 Reports: ${remainingReports}`);

        console.log('\n🎯 Demo user credentials:');
        console.log('   Email: demo@fashion.com');
        console.log('   Password: demo123');

    } catch (error) {
        console.error('❌ Error cleaning database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the cleanup
cleanDatabase();
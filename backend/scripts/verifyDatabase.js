const mongoose = require('mongoose');
require('dotenv').config();

// Import all models
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Follow = require('../models/Follow');
const Report = require('../models/Report');

async function verifyDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('\n📊 Current Database Status:\n');

        // Check Users
        const users = await User.find().select('username email role');
        console.log('👥 USERS:');
        users.forEach(user => {
            console.log(`   - ${user.username} (${user.email}) - Role: ${user.role}`);
        });

        // Check Posts
        const posts = await Post.find().populate('userId', 'username');
        console.log('\n📝 POSTS:');
        if (posts.length === 0) {
            console.log('   - No posts found');
        } else {
            posts.forEach(post => {
                console.log(`   - "${post.caption}" by ${post.userId?.username || 'Unknown'}`);
            });
        }

        // Check Comments
        const comments = await Comment.find().populate('userId', 'username');
        console.log('\n💬 COMMENTS:');
        if (comments.length === 0) {
            console.log('   - No comments found');
        } else {
            comments.forEach(comment => {
                console.log(`   - "${comment.content}" by ${comment.userId?.username || 'Unknown'}`);
            });
        }

        // Check Likes
        const likes = await Like.find().populate('userId', 'username');
        console.log('\n❤️  LIKES:');
        if (likes.length === 0) {
            console.log('   - No likes found');
        } else {
            likes.forEach(like => {
                console.log(`   - Like by ${like.userId?.username || 'Unknown'}`);
            });
        }

        // Check Follows
        const follows = await Follow.find()
            .populate('follower', 'username')
            .populate('following', 'username');
        console.log('\n👫 FOLLOWS:');
        if (follows.length === 0) {
            console.log('   - No follow relationships found');
        } else {
            follows.forEach(follow => {
                console.log(`   - ${follow.follower?.username || 'Unknown'} follows ${follow.following?.username || 'Unknown'}`);
            });
        }

        // Check Reports
        const reports = await Report.find().populate('reporter', 'username');
        console.log('\n🚩 REPORTS:');
        if (reports.length === 0) {
            console.log('   - No reports found');
        } else {
            reports.forEach(report => {
                console.log(`   - Report by ${report.reporter?.username || 'Unknown'}: ${report.reason}`);
            });
        }

        console.log('\n✅ Database verification completed!');

    } catch (error) {
        console.error('❌ Error verifying database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the verification
verifyDatabase();
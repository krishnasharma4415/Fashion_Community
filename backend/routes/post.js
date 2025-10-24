const express = require('express');
const auth = require('../middleware/auth');
const { uploadPost, processPostUpload } = require('../middleware/cloudinaryUpload');
const Post = require('../models/Post');
const User = require('../models/User');
const { validateText } = require('../ml/fashionDetector');

const router = express.Router();

router.post('/', auth, uploadPost.array('media', 10), processPostUpload, async (req, res) => {
    try {
        console.log('📝 Post creation request received');
        console.log('User ID:', req.user.id);
        console.log('Request body:', req.body);
        console.log('Files received:', req.files ? req.files.length : 0);
        
        const { caption } = req.body;

        if (!req.files || req.files.length === 0) {
            console.log('❌ No files received');
            return res.status(400).json({ message: 'At least one media file is required' });
        }

        console.log('📁 Files details:', req.files.map(f => ({
            originalname: f.originalname,
            path: f.path,
            filename: f.filename,
            size: f.size
        })));

        // Validate fashion content (optional - warn but don't block)
        if (caption) {
            try {
                const validation = await validateText(caption);
                if (!validation.isFashionRelated) {
                    console.log('⚠️ Fashion validation warning:', validation);
                    console.log('📝 Continuing with post creation despite validation warning');
                    // Continue with post creation - just log the warning
                } else {
                    console.log('✅ Fashion validation passed');
                }
            } catch (validationError) {
                console.warn('⚠️ Fashion validation error:', validationError);
                // Continue with post creation if validation fails
            }
        }

        // Map Cloudinary file data
        const media = req.files.map(file => ({
            url: file.path, // Cloudinary URL
            publicId: file.filename, // Cloudinary public ID for deletion
            type: 'image' // All uploads are images for now
        }));

        console.log('🖼️ Media mapped:', media);

        const newPost = new Post({ userId: req.user.id, caption, media });
        console.log('💾 Saving post to database...');
        await newPost.save();
        console.log('✅ Post saved with ID:', newPost._id);

        // Populate user data before sending response
        const populatedPost = await Post.findById(newPost._id).populate('userId', 'username profilePicture');
        console.log('👤 Post populated with user data');
        
        res.status(201).json(populatedPost);
        console.log('🎉 Post creation successful');
    } catch (err) {
        console.error('❌ Error creating post:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Get posts for home feed (only from followed users)
router.get("/", auth, async (req, res) => {
    try {
        const Follow = require('../models/Follow');
        
        // Get users that the current user follows
        const followedUsers = await Follow.find({ follower: req.user.id }).select('following');
        const followedUserIds = followedUsers.map(follow => follow.following);
        
        // Include the current user's own posts in the feed
        followedUserIds.push(req.user.id);
        
        // Get posts only from followed users (and own posts)
        const posts = await Post.find({ userId: { $in: followedUserIds } })
            .populate("userId", "username profilePicture")
            .sort({ timestamp: -1 }); // Most recent first
            
        res.json(posts);
    } catch (err) {
        console.error("Error fetching home feed:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all posts for explore page (excluding current user's posts)
router.get("/explore", auth, async (req, res) => {
    try {
        const posts = await Post.find({ userId: { $ne: req.user.id } })
            .populate("userId", "username profilePicture")
            .sort({ timestamp: -1 }); // Most recent first
            
        res.json(posts);
    } catch (err) {
        console.error("Error fetching explore posts:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all posts (admin/public endpoint - no auth required)
router.get("/all", async (req, res) => {
    try {
        const posts = await Post.find().populate("userId", "username profilePicture");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete images from Cloudinary if they have publicIds
        if (post.media && post.media.length > 0) {
            const { deleteMultipleImages } = require('../utils/cloudinaryHelpers');
            const publicIds = post.media
                .filter(media => media.publicId)
                .map(media => media.publicId);
            
            if (publicIds.length > 0) {
                try {
                    await deleteMultipleImages(publicIds);
                    console.log('Images deleted from Cloudinary:', publicIds);
                } catch (cloudinaryError) {
                    console.error('Error deleting images from Cloudinary:', cloudinaryError);
                    // Continue with post deletion even if Cloudinary deletion fails
                }
            }
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user/:userId', auth, async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.params.userId })
            .sort({ timestamp: -1 }) // Most recent first
            .populate('userId', 'username profilePicture');
        
        res.json(userPosts);
    } catch (err) {
        console.error("Error fetching user posts:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/upload', auth, uploadPost.single('media'), processPostUpload, (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File upload failed' });

    res.json({
        mediaUrl: req.file.path, // Cloudinary URL
        publicId: req.file.filename, // Cloudinary public ID
        mediaType: 'image'
    });
});

router.post('/save/:postId', auth, async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;
  
    try {
      const user = await User.findById(userId);
      const index = user.savedPosts.indexOf(postId);
  
      if (index > -1) {
        user.savedPosts.splice(index, 1);
      } else {
        user.savedPosts.push(postId);
      }
  
      await user.save();
      res.json({ message: 'Save status updated', savedPosts: user.savedPosts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/saved/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate({
        path: 'savedPosts',
        populate: {
          path: 'userId',
          select: 'username profilePicture'
        }
      });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user.savedPosts);
    } catch (err) {
      console.error("❌ Error fetching saved posts:", err);
      res.status(500).json({ message: "Server error" });
    }
  });
  

module.exports = router;

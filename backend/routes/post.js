const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Post = require('../models/Post');
const User = require('../models/User');

const router = express.Router();

router.post('/', auth, upload.array('media', 10), async (req, res) => {
    try {
        const { caption } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one media file is required' });
        }

        const media = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            type: file.mimetype.startsWith('image') ? 'image' : 'video'
        }));

        const newPost = new Post({ userId: req.user.id, caption, media });
        await newPost.save();

        res.status(201).json(newPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/", async (req, res) => {
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

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/user/:userId', async (req, res) => {
    try {
        const userPosts = await Post.find({ userId: req.params.userId })
            .sort({ createdAt: -1 }) // optional: newest first
            .populate('userId', 'username profilePicture');
        
        res.json(userPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/upload', auth, upload.single('media'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File upload failed' });

    res.json({
        mediaUrl: `/uploads/${req.file.filename}`,
        mediaType: req.file.mimetype.startsWith('image') ? 'image' : 'video'
    });
});

// Save or unsave post
router.post('/save/:postId', auth, async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;
  
    try {
      const user = await User.findById(userId);
      const index = user.savedPosts.indexOf(postId);
  
      if (index > -1) {
        user.savedPosts.splice(index, 1); // unsave
      } else {
        user.savedPosts.push(postId); // save
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

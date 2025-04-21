const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Report = require('../models/Report');

const router = express.Router();

// ---------------------- ADMIN AUTHENTICATION ----------------------

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const adminUser = await User.findOne({ email, role: 'admin' });
        if (!adminUser) return res.status(400).json({ message: 'Invalid credentials or not an admin' });

        const isMatch = await bcrypt.compare(password, adminUser.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: adminUser._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, adminId: adminUser._id });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------------------- USER MANAGEMENT ----------------------

router.get('/users', auth, admin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/users/:id', auth, admin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------------------- POST MANAGEMENT ----------------------

router.get('/posts', auth, admin, async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'username');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/posts/:id', auth, admin, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------------------- COMMENT MANAGEMENT ----------------------

router.get('/comments', auth, admin, async (req, res) => {
    try {
        const comments = await Comment.find().populate('userId', 'username').populate('postId', 'caption');
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/comments/:id', auth, admin, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------------------- LIKE MANAGEMENT ----------------------

router.get('/likes', auth, admin, async (req, res) => {
    try {
        const likes = await Like.find().populate('userId', 'username').populate('postId', 'caption');
        res.json(likes);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/likes/:id', auth, admin, async (req, res) => {
    try {
        await Like.findByIdAndDelete(req.params.id);
        res.json({ message: 'Like removed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------------------- SYSTEM STATISTICS ----------------------

router.get('/stats', auth, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const commentCount = await Comment.countDocuments();
        const likeCount = await Like.countDocuments();

        res.json({ userCount, postCount, commentCount, likeCount });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ---------------------- REPORT MANAGEMENT ----------------------

// routes/admin.js
router.get('/reports', auth, admin, async (req, res) => {
    try {
      const reports = await Report.find()
        .populate('reporter', 'username email')
        .lean();
  
      // Fetch target info based on report type
      const populateTargets = async (reports) => {
        const populated = await Promise.all(reports.map(async (r) => {
          let targetDoc = null;
  
          if (r.type === 'post') {
            targetDoc = await Post.findById(r.target).select('caption');
          } else if (r.type === 'comment') {
            targetDoc = await Comment.findById(r.target).select('content');
          } else if (r.type === 'user') {
            targetDoc = await User.findById(r.target).select('username email');
          }
  
          return {
            ...r,
            targetData: targetDoc || null,
          };
        }));
  
        return populated;
      };
  
      const reportsWithTarget = await populateTargets(reports);
  
      res.json(reportsWithTarget);
    } catch (err) {
      console.error("Error fetching reports:", err);
      res.status(500).json({ message: 'Server error' });
    }
  });  

router.put('/reports/:id', auth, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['reviewed', 'resolved', 'dismissed', 'actioned'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });

    res.json({ message: 'Report updated successfully', report });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

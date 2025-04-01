const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const Post = require('../models/Post');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { caption, media } = req.body;
        const newPost = new Post({ userId: req.user.id, caption, media });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId', 'username profilePicture');
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
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

        // Check if the user is the owner
        if (post.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/upload', auth, upload.single('media'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'File upload failed' });
    res.json({ mediaUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;

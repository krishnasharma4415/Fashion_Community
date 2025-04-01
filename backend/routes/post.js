const express = require("express");
const auth = require("../middleware/auth");
const Post = require("../models/Post");

const router = express.Router();

// Create Post
router.post("/", auth, async (req, res) => {
    try {
        const newPost = new Post({ userId: req.user.id, caption: req.body.caption, media: req.body.media });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("userId", "username profilePicture");
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

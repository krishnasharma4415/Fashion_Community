const express = require("express");
const auth = require("../middleware/auth");
const Like = require("../models/Like");
const Post = require("../models/Post");

const router = express.Router();

router.post("/:postId", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const existingLike = await Like.findOne({ userId: req.user.id, postId: req.params.postId });
        if (existingLike) return res.status(400).json({ message: "Already liked this post" });

        const newLike = new Like({ userId: req.user.id, postId: req.params.postId });
        await newLike.save();
        res.status(201).json(newLike);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:postId", auth, async (req, res) => {
    try {
        const like = await Like.findOneAndDelete({ userId: req.user.id, postId: req.params.postId });
        if (!like) return res.status(404).json({ message: "Like not found" });

        res.json({ message: "Post unliked successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:postId", async (req, res) => {
    try {
        const likeCount = await Like.countDocuments({ postId: req.params.postId });
        res.json({ likes: likeCount });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

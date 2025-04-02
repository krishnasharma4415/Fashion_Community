const express = require("express");
const auth = require("../middleware/auth");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const router = express.Router();

router.post("/:postId", auth, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = new Comment({
            userId: req.user.id,
            postId: req.params.postId,
            content,
        });

        await newComment.save();

        await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });

        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:postId", async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate("userId", "username");
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:commentId", auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });

        if (comment.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await comment.deleteOne();

        await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });

        res.json({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

const express = require("express");
const auth = require("../middleware/auth");
const Follow = require("../models/Follow");
const User = require("../models/User");

const router = express.Router();

router.post("/:userId", auth, async (req, res) => {
    try {
        if (req.user.id === req.params.userId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const alreadyFollowing = await Follow.findOne({ follower: req.user.id, following: req.params.userId });
        if (alreadyFollowing) return res.status(400).json({ message: "Already following this user" });

        const newFollow = new Follow({ follower: req.user.id, following: req.params.userId });
        await newFollow.save();
        res.status(201).json(newFollow);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:userId", auth, async (req, res) => {
    try {
        const follow = await Follow.findOneAndDelete({ follower: req.user.id, following: req.params.userId });
        if (!follow) return res.status(404).json({ message: "Not following this user" });

        res.json({ message: "User unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:userId/followers", async (req, res) => {
    try {
        const followers = await Follow.countDocuments({ following: req.params.userId });
        res.json({ followers });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:userId/following", async (req, res) => {
    try {
        const following = await Follow.countDocuments({ follower: req.params.userId });
        res.json({ following });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

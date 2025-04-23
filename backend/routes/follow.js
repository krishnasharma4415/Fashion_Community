const express = require("express");
const auth = require("../middleware/auth");
const Follow = require("../models/Follow");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");

const router = express.Router();

// Follow a user
router.post("/:userId", auth, async (req, res) => {
  try {
    if (req.user.id === req.params.userId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if target user exists
    const targetUser = await User.findById(req.params.userId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const alreadyFollowing = await Follow.findOne({ 
      follower: req.user.id, 
      following: req.params.userId 
    });
    
    if (alreadyFollowing) {
      return res.status(400).json({ message: "Already following this user" });
    }

    const newFollow = new Follow({ 
      follower: req.user.id, 
      following: req.params.userId 
    });
    await newFollow.save();

    await UserActivity.create({
      userId: req.user.id,
      targetUserId: req.params.userId,
      activityType: "follow",
    });

    res.status(201).json(newFollow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Unfollow a user
router.delete("/:userId", auth, async (req, res) => {
  try {
    const follow = await Follow.findOneAndDelete({ 
      follower: req.user.id, 
      following: req.params.userId 
    });
    
    if (!follow) {
      return res.status(404).json({ message: "Not following this user" });
    }

    await UserActivity.create({
      userId: req.user.id,
      targetUserId: req.params.userId,
      activityType: "unfollow",
    });

    res.json({ message: "User unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get follower count
router.get("/:userId/followers/count", async (req, res) => {
  try {
    const count = await Follow.countDocuments({ following: req.params.userId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get following count
router.get("/:userId/following/count", async (req, res) => {
  try {
    const count = await Follow.countDocuments({ follower: req.params.userId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Check if current user is following target user
router.get("/:userId/status", auth, async (req, res) => {
  try {
    const follow = await Follow.findOne({ 
      follower: req.user.id, 
      following: req.params.userId 
    });
    
    res.json({ isFollowing: !!follow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get followers list
router.get("/:userId/followers", async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate("follower", "username profilePicture bio")
      .sort({ timestamp: -1 });
    
    res.json(followers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get following list
router.get("/:userId/following", async (req, res) => {
  try {
    const following = await Follow.find({ follower: req.params.userId })
      .populate("following", "username profilePicture bio")
      .sort({ timestamp: -1 });
    
    res.json(following);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
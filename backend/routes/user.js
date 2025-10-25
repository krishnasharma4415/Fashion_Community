const express = require("express");
const auth = require("../middleware/auth");
const { uploadProfile, processProfileUpload } = require('../middleware/cloudinaryUpload');
const User = require("../models/User");

const router = express.Router();

// Test auth endpoint
router.get("/test-auth", auth, async (req, res) => {
  console.log("Test auth endpoint hit, user:", req.user);
  res.json({ message: "Auth working", user: req.user });
});

// Profile update route (must be before /:id routes)
router.put('/profile', auth, uploadProfile.single('profilePicture'), processProfileUpload, async (req, res) => {
  console.log("=== PROFILE UPDATE ROUTE HIT ===");
  console.log("User from auth middleware:", req.user);
  console.log("Request headers:", req.headers);
  
  try {
    console.log("Profile update request received:", {
      userId: req.user ? req.user.id : 'NO USER',
      body: req.body,
      file: req.file ? `${req.file.fieldname} received` : 'no file'
    });

      const user = await User.findById(req.user.id);

      if (!user) {
        console.log("User not found with ID:", req.user.id);
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      if (req.body.username && req.body.username.trim()) {
        user.username = req.body.username.trim();
      }
      
      if (req.body.displayName !== undefined) {
        user.displayName = req.body.displayName.trim();
      }
      
      if (req.body.bio !== undefined) {
        user.bio = req.body.bio;
      }
      
      // Mark profile as completed for Google OAuth users
      if (req.body.profileCompleted === 'true') {
        user.profileCompleted = true;
      }

      // Handle profile picture upload
      if (req.file) {
        console.log("File uploaded to Cloudinary:", {
          path: req.file.path,
          filename: req.file.filename
        });
        
        // Store Cloudinary URL and public ID
        user.profilePicture = req.file.path; // Cloudinary URL
        user.profilePicturePublicId = req.file.filename; // For deletion if needed
        console.log("Updated profile picture URL:", user.profilePicture);
      }

      const updatedUser = await user.save();
      console.log("User updated successfully:", updatedUser.username);

      res.json({
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          username: updatedUser.username,
          displayName: updatedUser.displayName,
          email: updatedUser.email,
          bio: updatedUser.bio,
          profilePicture: updatedUser.profilePicture,
          isGoogleUser: updatedUser.isGoogleUser,
          profileCompleted: updatedUser.profileCompleted,
        },
      });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// Search users by username or email (must be before /:id routes)
router.get("/search", auth, async (req, res) => {
  try {
    const { q } = req.query; // search query
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }

    const searchRegex = new RegExp(q.trim(), 'i'); // case-insensitive search
    
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user.id } }, // Exclude current user
        {
          $or: [
            { username: searchRegex },
            { displayName: searchRegex },
            { email: searchRegex }
          ]
        }
      ]
    })
    .select('username displayName email profilePicture bio')
    .limit(20); // Limit results

    res.json(users);
  } catch (err) {
    console.error("Error searching users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile with additional stats (for visiting profiles)
router.get("/:id/profile", auth, async (req, res) => {
  try {
    const Follow = require('../models/Follow');
    const Post = require('../models/Post');
    
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Get follower and following counts
    const followerCount = await Follow.countDocuments({ following: req.params.id });
    const followingCount = await Follow.countDocuments({ follower: req.params.id });
    
    // Get post count
    const postCount = await Post.countDocuments({ userId: req.params.id });
    
    // Check if current user is following this user
    const isFollowing = await Follow.findOne({ 
      follower: req.user.id, 
      following: req.params.id 
    });

    res.json({
      ...user.toObject(),
      stats: {
        followers: followerCount,
        following: followingCount,
        posts: postCount
      },
      isFollowing: !!isFollowing,
      isOwnProfile: req.user.id === req.params.id
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
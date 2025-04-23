const express = require("express");
const auth = require("../middleware/auth");
const upload = require('../middleware/upload');
const User = require("../models/User");
const path = require('path');

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
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

// PUT /api/users/profile
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log("Profile update request received:", {
      userId: req.user.id,
      body: req.body,
      file: req.file ? `${req.file.fieldname} received` : 'no file'
    });

    const user = await User.findById(req.user.id);

    if (!user) {
      console.log("User not found with ID:", req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields if provided
    if (req.body.username) user.username = req.body.username;
    if (req.body.bio !== undefined) user.bio = req.body.bio;

    // Handle profile picture upload
    if (req.file) {
      // Calculate relative path from upload directory
      const relativePath = path.join('/uploads/profiles', path.basename(req.file.path));
      user.profilePicture = relativePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes
      console.log("Updated profile picture path:", user.profilePicture);
    }

    const updatedUser = await user.save();
    console.log("User updated successfully:", updatedUser.username);

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        bio: updatedUser.bio,
        profilePicture: updatedUser.profilePicture,
      },
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});
  
module.exports = router;
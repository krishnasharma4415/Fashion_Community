// backend/controllers/userController.js
const User = require('../models/User');
const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const asyncHandler = require('express-async-handler');

// Register a new user
exports.register = asyncHandler(async (req, res) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json(successResponse(userData, 'User registered successfully', 201));
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Login user
exports.login = asyncHandler(async (req, res) => {
  try {
    const { login, password } = req.body;
    
    if (!login || !password) {
      res.status(400);
      throw new Error('Please provide login and password');
    }
    
    const userData = await authService.loginUser(login, password);
    res.status(200).json(successResponse(userData, 'Login successful'));
  } catch (error) {
    res.status(401);
    throw new Error(error.message);
  }
});

// Get current user profile
exports.getCurrentUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    res.status(200).json(successResponse(user, 'User profile retrieved'));
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

// Get user profile by username
exports.getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password')
      .lean();
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    res.status(200).json(successResponse(user, 'User profile retrieved'));
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, bio, website } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    user.name = name || user.name;
    user.bio = bio !== undefined ? bio : user.bio;
    user.website = website !== undefined ? website : user.website;
    
    const updatedUser = await user.save();
    
    res.status(200).json(successResponse(updatedUser, 'Profile updated successfully'));
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

// Follow a user
exports.followUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if user exists
    const userToFollow = await User.findById(id);
    
    if (!userToFollow) {
      res.status(404);
      throw new Error('User not found');
    }
    
    // Check if already following
    const alreadyFollowing = await Relationship.findOne({
      follower: userId,
      following: id
    });
    
    if (alreadyFollowing) {
      res.status(400);
      throw new Error('Already following this user');
    }
    
    // Create follow relationship
    await Relationship.create({
      follower: userId,
      following: id
    });
    
    // Update follower/following counts
    await User.findByIdAndUpdate(userId, {
      $inc: { followingCount: 1 }
    });
    
    await User.findByIdAndUpdate(id, {
      $inc: { followersCount: 1 }
    });
    
    res.status(200).json(successResponse(null, 'User followed successfully'));
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});

// Unfollow a user
exports.unfollowUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if relationship exists
    const relationship = await Relationship.findOne({
      follower: userId,
      following: id
    });
    
    if (!relationship) {
      res.status(400);
      throw new Error('Not following this user');
    }
    
    // Remove relationship
    await relationship.remove();
    
    // Update follower/following counts
    await User.findByIdAndUpdate(userId, {
      $inc: { followingCount: -1 }
    });
    
    await User.findByIdAndUpdate(id, {
      $inc: { followersCount: -1 }
    });
    
    res.status(200).json(successResponse(null, 'User unfollowed successfully'));
  } catch (error) {
    res.status(500);
    throw new Error('Server error');
  }
});
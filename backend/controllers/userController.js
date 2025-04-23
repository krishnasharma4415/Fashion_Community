const User = require('../models/User');
const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const asyncHandler = require('express-async-handler');

exports.register = asyncHandler(async (req, res) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json(successResponse(userData, 'User registered successfully', 201));
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

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

exports.followUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const userToFollow = await User.findById(id);
    
    if (!userToFollow) {
      res.status(404);
      throw new Error('User not found');
    }
    
    const alreadyFollowing = await Relationship.findOne({
      follower: userId,
      following: id
    });
    
    if (alreadyFollowing) {
      res.status(400);
      throw new Error('Already following this user');
    }
    
    await Relationship.create({
      follower: userId,
      following: id
    });
    
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

exports.unfollowUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const relationship = await Relationship.findOne({
      follower: userId,
      following: id
    });
    
    if (!relationship) {
      res.status(400);
      throw new Error('Not following this user');
    }
    
    await relationship.remove();
    
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
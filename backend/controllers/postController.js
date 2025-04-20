// backend/controllers/postController.js
const Post = require('../models/Post');
const User = require('../models/User');
const contentFilter = require('../ml/contentFilter');
const InteractionService = require('../services/interactionService');

// Create a new post with fashion content validation
exports.createPost = async (req, res) => {
  try {
    const { caption, media, tags, location } = req.body;
    const userId = req.user.id;
    
    // Validate fashion content
    const contentValidation = await contentFilter.isFashionRelated(caption, tags);
    
    if (!contentValidation.isFashionRelated) {
      return res.status(400).json({
        success: false,
        message: 'Your post must be fashion-related. Please ensure your content and tags are about fashion, style, or clothing.'
      });
    }
    
    // Create the post
    const newPost = new Post({
      user: userId,
      caption,
      media,
      tags,
      location,
      contentFeatures: {
        styleCategories: [contentValidation.category]
      }
    });
    
    await newPost.save();
    
    // Update user post count
    await User.findByIdAndUpdate(userId, {
      $inc: { postsCount: 1 }
    });
    
    res.status(201).json({
      success: true,
      data: newPost
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Get a post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username name profilePicture')
      .lean();
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Track view interaction if user is logged in
    if (req.user) {
      await InteractionService.trackInteraction(req.user.id, post._id, 'view');
    }
    
    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error getting post:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Other controller methods...
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const commentFilter = require('../ml/commentFilter');
const InteractionService = require('../services/interactionService');

exports.createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;
    const userId = req.user.id;
    
    const toxicityCheck = await commentFilter.isToxicComment(text);
    
    if (toxicityCheck.isToxic) {
      return res.status(400).json({
        success: false,
        message: 'Your comment contains inappropriate language or content that violates our community guidelines.'
      });
    }
    
    const newComment = new Comment({
      user: userId,
      post: postId,
      text
    });
    
    await newComment.save();
    
    await Post.findByIdAndUpdate(postId, {
      $inc: { commentsCount: 1 }
    });
    
    await InteractionService.trackInteraction(userId, postId, 'comment');
    
    await newComment.populate('user', 'username profilePicture');
    
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

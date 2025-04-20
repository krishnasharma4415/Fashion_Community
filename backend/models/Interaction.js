// models/Interaction.js
const mongoose = require('mongoose');

const InteractionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  interactionType: {
    type: String,
    enum: ['view', 'like', 'save', 'comment', 'share'],
    required: true
  },
  viewDuration: Number, // in seconds
  viewPercentage: Number, // for carousel posts
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'other'],
    default: 'mobile'
  },
  context: {
    type: String,
    enum: ['feed', 'explore', 'profile', 'direct', 'hashtag', 'search'],
    default: 'feed'
  },
  interactionDetails: {
    // For more specific interactions like reaction types
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  sessionId: String
}, { timestamps: true });

// Indexes for quick access
InteractionSchema.index({ user: 1, createdAt: -1 });
InteractionSchema.index({ post: 1, interactionType: 1 });
InteractionSchema.index({ user: 1, interactionType: 1, createdAt: -1 });

module.exports = mongoose.model('Interaction', InteractionSchema);
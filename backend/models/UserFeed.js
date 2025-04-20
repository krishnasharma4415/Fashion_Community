// models/UserFeed.js
const mongoose = require('mongoose');

const UserFeedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  feedCursor: {
    type: String,
    default: null
  },
  // For performance optimization
  feedVersion: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

// Compound index for fast queries
UserFeedSchema.index({ user: 1, lastUpdated: -1 });

module.exports = mongoose.model('UserFeed', UserFeedSchema);
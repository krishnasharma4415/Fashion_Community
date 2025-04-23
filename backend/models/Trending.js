const mongoose = require('mongoose');

const TrendingSchema = new mongoose.Schema({
  scope: {
    type: String,
    enum: ['global', 'regional', 'category'],
    default: 'global',
    required: true
  },
  region: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: null
  },
  trendingPosts: [{
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    },
    trendScore: {
      type: Number,
      default: 0
    },
    velocity: {
      type: Number,
      default: 0
    }
  }],
  trendingHashtags: [{
    tag: String,
    postCount: Number,
    engagementRate: Number
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  validUntil: {
    type: Date,
    required: true
  }
}, { timestamps: true });

TrendingSchema.index({ scope: 1, region: 1, updatedAt: -1 });
TrendingSchema.index({ scope: 1, category: 1, updatedAt: -1 });

module.exports = mongoose.model('Trending', TrendingSchema);
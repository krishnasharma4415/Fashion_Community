// models/UserInterest.js
const mongoose = require('mongoose');

const UserInterestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  interests: [{
    category: String,
    weight: {
      type: Number,
      default: 1.0, // 0-5 scale, higher means stronger interest
      min: 0,
      max: 5
    },
    source: {
      type: String,
      enum: ['explicit', 'implicit', 'derived'],
      default: 'implicit'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  contentEngagement: {
    averageViewDuration: Number, // in seconds
    peakEngagementHours: [Number], // 0-23 representing hours of the day
    engagementScore: {
      type: Number,
      default: 0
    }
  },
  topHashtags: [{
    tag: String,
    interactionCount: Number
  }],
  recentSearches: [{
    term: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('UserInterest', UserInterestSchema);
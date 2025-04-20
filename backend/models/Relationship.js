// models/Relationship.js
const mongoose = require('mongoose');

const RelationshipSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'pending', 'rejected'],
    default: 'accepted' // For private accounts, default would be 'pending'
  },
  notificationsEnabled: {
    type: Boolean,
    default: true
  },
  closeFriend: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Compound index to ensure uniqueness and fast queries
RelationshipSchema.index({ follower: 1, following: 1 }, { unique: true });
// Index for finding followers of a user
RelationshipSchema.index({ following: 1, status: 1 });
// Index for finding who a user follows
RelationshipSchema.index({ follower: 1, status: 1 });

module.exports = mongoose.model('Relationship', RelationshipSchema);
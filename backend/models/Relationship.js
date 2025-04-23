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
    default: 'accepted'
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

RelationshipSchema.index({ follower: 1, following: 1 }, { unique: true });
RelationshipSchema.index({ following: 1, status: 1 });
RelationshipSchema.index({ follower: 1, status: 1 });

module.exports = mongoose.model('Relationship', RelationshipSchema);
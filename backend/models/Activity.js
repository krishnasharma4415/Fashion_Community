// models/Activity.js
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  actionType: {
    type: String,
    enum: ['like', 'comment', 'follow', 'mention', 'tag', 'share'],
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  },
  seen: {
    type: Boolean,
    default: false
  },
  isNotifiable: {
    type: Boolean,
    default: true
  },
  groupKey: String 
}, { timestamps: true });

ActivitySchema.index({ recipient: 1, createdAt: -1 });
ActivitySchema.index({ actor: 1, actionType: 1, createdAt: -1 });
ActivitySchema.index({ recipient: 1, seen: 1 });

module.exports = mongoose.model('Activity', ActivitySchema);
// models/Block.js
const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema({
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blocked: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'inappropriate_content', 'other'],
    default: 'other'
  },
  notes: String
}, { timestamps: true });

// Compound index to ensure uniqueness and fast queries
BlockSchema.index({ blocker: 1, blocked: 1 }, { unique: true });
// Index for checking if a user is blocked
BlockSchema.index({ blocked: 1 });

module.exports = mongoose.model('Block', BlockSchema);
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, default: '' },
    media: { type: String, required: true }, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);

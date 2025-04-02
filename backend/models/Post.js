const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, default: '' },
    media: [{ 
        url: { type: String, required: true }, 
        type: { type: String, enum: ['image', 'video'], required: true } 
    }],
    likeCount: { type: Number, default: 0 },  
    commentCount: { type: Number, default: 0 },  
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);

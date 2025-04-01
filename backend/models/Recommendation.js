const mongoose = require('mongoose');

const AIRecommendationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recommendedPostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AIRecommendation', AIRecommendationSchema);

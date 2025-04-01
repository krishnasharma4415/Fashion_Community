const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reportId: { type: mongoose.Schema.Types.ObjectId, auto: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    reportedId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    reportType: { type: String, enum: ['post', 'comment', 'user'], required: true }, 
    reason: { type: String, required: true }, 
    status: { type: String, enum: ['pending', 'reviewed', 'resolved'], default: 'pending' }, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);

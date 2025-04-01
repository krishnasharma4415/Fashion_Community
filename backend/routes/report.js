const express = require('express');
const auth = require('../middleware/auth');
const Report = require('../models/Report');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    try {
        const { reportedId, reportType, reason } = req.body;

        if (!['post', 'comment', 'user'].includes(reportType)) {
            return res.status(400).json({ message: 'Invalid report type' });
        }

        const report = new Report({
            userId: req.user.id,
            reportedId,
            reportType,
            reason
        });

        await report.save();
        res.status(201).json({ message: 'Report submitted successfully' });

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

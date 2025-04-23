const express = require('express');
const auth = require('../middleware/auth');
const Report = require('../models/Report');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { type, target, reason, details } = req.body;

    if (!['post', 'comment', 'user'].includes(type)) {
      return res.status(400).json({ message: 'Invalid report type' });
    }

    const report = new Report({
      type,
      target,
      reporter: req.user.id,
      reason,
      details,
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully' });
  } catch (err) {
    console.error("Error submitting report:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

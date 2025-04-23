const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');

router.get('/follow-count/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const followerCount = await Follow.countDocuments({ followingId: userId });

    const followingCount = await Follow.countDocuments({ followerId: userId });

    res.status(200).json({
      userId,
      followerCount,
      followingCount
    });
  } catch (error) {
    console.error('Error fetching follow counts:', error);
    res.status(500).json({ error: 'Failed to fetch follow counts' });
  }
});

module.exports = router;

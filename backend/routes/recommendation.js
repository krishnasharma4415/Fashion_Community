const express = require("express");
const auth = require("../middleware/auth");
const Recommendation = require("../models/Recommendation");

const router = express.Router();

router.get("/", auth, async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ userId: req.user.id }).populate("postId");
        res.json(recommendations);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;

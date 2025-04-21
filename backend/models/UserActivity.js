const mongoose = require("mongoose");

const UserActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  activityType: {
    type: String,
    enum: ["like", "unlike", "comment", "delete_comment", "follow", "unfollow"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserActivity", UserActivitySchema);

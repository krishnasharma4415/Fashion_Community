const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: { type: String },
    media: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);
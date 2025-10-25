const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    displayName: { type: String, default: '' }, // User's display name (can be changed)
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    profilePicturePublicId: { type: String, default: '' }, // For Cloudinary deletion
    bio: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    savedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
    // Google OAuth fields
    googleId: { type: String, unique: true, sparse: true },
    isGoogleUser: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false }, // Track if profile setup is complete
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
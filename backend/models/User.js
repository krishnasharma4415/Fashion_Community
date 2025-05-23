const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    bio: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    savedPosts: [{type: mongoose.Schema.Types.ObjectId, ref: "Post"}],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
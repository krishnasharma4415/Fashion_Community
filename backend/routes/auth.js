const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword,
            profileCompleted: true // Regular signup users have completed profile setup
        });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName || '',
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                bio: user.bio,
                isGoogleUser: user.isGoogleUser || false,
                profileCompleted: user.profileCompleted !== false // Default to true for existing users
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

router.get("/check-token", auth, (req, res) => {
    try {
        res.json({
            valid: true,
            user: { id: req.user.id }
        });
    } catch (err) {
        console.error("Token check error:", err);
        res.status(401).json({ valid: false, message: "Invalid token" });
    }
});

// Check username availability
router.post("/check-username", async (req, res) => {
    try {
        const { username } = req.body;
        
        if (!username) {
            return res.status(400).json({ 
                available: false, 
                message: "Username is required" 
            });
        }

        const existingUser = await User.findOne({ username });
        const available = !existingUser;
        
        res.json({
            available,
            message: available ? "Username is available" : "Username is already taken"
        });
    } catch (err) {
        console.error("Username check error:", err);
        res.status(500).json({ 
            available: false, 
            message: "Error checking username availability" 
        });
    }
});

// Check email availability
router.post("/check-email", async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                available: false, 
                message: "Email is required" 
            });
        }

        const existingUser = await User.findOne({ email });
        const available = !existingUser;
        
        res.json({
            available,
            message: available ? "Email is available" : "Email is already registered"
        });
    } catch (err) {
        console.error("Email check error:", err);
        res.status(500).json({ 
            available: false, 
            message: "Error checking email availability" 
        });
    }
});

// Request password reset
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "No account found with this email address" 
            });
        }

        // Generate reset token (in a real app, you'd send this via email)
        const resetToken = jwt.sign(
            { id: user._id, purpose: 'password-reset' }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" }
        );

        // In a real application, you would send this token via email
        // For demo purposes, we'll just return it
        res.json({
            success: true,
            message: "Password reset instructions sent to your email",
            resetToken // Remove this in production
        });
    } catch (err) {
        console.error("Password reset request error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error processing password reset request" 
        });
    }
});

// Reset password with token
router.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Token and new password are required" 
            });
        }

        // Verify reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.purpose !== 'password-reset') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid reset token" 
            });
        }

        // Find user and update password
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (err) {
        if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid or expired reset token" 
            });
        }
        
        console.error("Password reset error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Error resetting password" 
        });
    }
});

// Google OAuth authentication
router.post("/google", async (req, res) => {
    try {
        const { idToken, email, name, firstName, lastName, imageUrl, googleId } = req.body;
        
        if (!idToken || !email) {
            return res.status(400).json({ 
                success: false, 
                message: "Google ID token and email are required" 
            });
        }

        // In a production app, you should verify the idToken with Google
        // For now, we'll trust the client-side verification
        
        // Check if user already exists
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { googleId: googleId }
            ]
        });

        let isNewUser = false;
        
        if (user) {
            // Existing user signing in
            if (!user.googleId) {
                user.googleId = googleId;
                user.profilePicture = user.profilePicture || imageUrl;
                user.isGoogleUser = true;
                // For existing users, mark profile as completed if they have basic info
                if (user.username && user.email) {
                    user.profileCompleted = true;
                }
                await user.save();
            }
        } else {
            // Create new user - they will need to complete profile setup
            isNewUser = true;
            const tempUsername = email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 4);
            
            user = new User({
                username: tempUsername, // Temporary username, user will choose their own
                displayName: firstName || name || '', // Set display name from Google
                email: email,
                googleId: googleId,
                profilePicture: imageUrl,
                bio: `Hi, I'm ${firstName || name}!`,
                // No password needed for Google OAuth users
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random password as fallback
                isGoogleUser: true,
                profileCompleted: false // New Google users need to complete profile
            });
            
            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.json({
            success: true,
            token,
            isNewUser, // Add flag to indicate if this is a new user
            user: {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                bio: user.bio,
                isGoogleUser: user.isGoogleUser,
                profileCompleted: user.profileCompleted
            }
        });
    } catch (err) {
        console.error("Google OAuth error:", err);
        res.status(500).json({ 
            success: false, 
            message: "Google authentication failed" 
        });
    }
});

module.exports = router;
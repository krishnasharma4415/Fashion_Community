const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            console.log("Access denied: No Authorization header");
            return res.status(401).json({ message: "Access denied: No Authorization header" });
        }

        if (!authHeader.startsWith("Bearer ")) {
            console.log("Invalid token format: Doesn't start with Bearer");
            return res.status(401).json({ message: "Invalid token format" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            console.log("Empty token after Bearer");
            return res.status(401).json({ message: "Empty token" });
        }

        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token verified successfully for user:", verified.id);
            req.user = verified;
            next();
        } catch (err) {
            console.log("JWT Verification error:", err.message);
            return res.status(401).json({ message: "Invalid token: " + err.message });
        }
    } catch (err) {
        console.error("Auth middleware error:", err);
        res.status(500).json({ message: "Server error in auth middleware" });
    }
};

module.exports = auth;

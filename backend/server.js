const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Cloudinary handles file serving, no need for local uploads static serving

app.use('/api/admin', require('./routes/admin'));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/users", require("./routes/user"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/likes", require("./routes/like"));
app.use("/api/follows", require("./routes/follow"));
app.use("/api/recommendations", require("./routes/recommendation"));

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // In development, just send a simple message for non-API routes
  app.get('*', (req, res) => {
    res.json({ message: 'API is running. Frontend is served separately in development.' });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

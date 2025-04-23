const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/profiles', express.static(path.join(__dirname, 'uploads/profiles')));

app.use('/api/admin', require('./routes/admin'));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/posts", require("./routes/post"));
app.use("/api/users", require("./routes/user"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/likes", require("./routes/like"));
app.use("/api/follows", require("./routes/follow"));
app.use("/api/recommendations", require("./routes/recommendation"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

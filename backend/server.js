const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

connectDB();

// CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? [
          'https://your-frontend-domain.vercel.app', // Update this after Vercel deployment
          /\.vercel\.app$/, // Allow any Vercel app during deployment
          /localhost:\d+$/ // Allow localhost for testing
        ]
      : [
          'http://localhost:5173', 
          'http://localhost:3000',
          'http://localhost:5174'
        ];
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fashion Community API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API documentation endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Fashion Community API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users', 
      posts: '/api/posts',
      comments: '/api/comments',
      likes: '/api/likes',
      follows: '/api/follows',
      recommendations: '/api/recommendations',
      admin: '/api/admin'
    },
    docs: 'Frontend is deployed separately on Vercel'
  });
});

// Handle 404 for non-API routes
app.get('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'This is an API server. Frontend is served separately.',
    availableRoutes: ['/api/auth', '/api/users', '/api/posts', '/api/comments', '/api/likes', '/api/follows', '/api/recommendations', '/api/admin']
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Fashion Community API Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`🌐 Production server ready for frontend connections`);
  }
});

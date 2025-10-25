# 👗 Fashion Community

A modern, full-stack social media platform designed specifically for fashion enthusiasts. Share your style, discover trends, and connect with fellow fashion lovers in a beautifully designed, feature-rich environment.

![Fashion Community](https://img.shields.io/badge/Fashion-Community-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3.1-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=flat-square&logo=mongodb)
![Deployed](https://img.shields.io/badge/Status-Live-success?style=flat-square)

## 🌟 Live Demo

- **Frontend**: [https://fashion-community-mguq.vercel.app](https://fashion-community-mguq.vercel.app)
- **Backend API**: [https://fashion-community-backend.onrender.com](https://fashion-community-backend.onrender.com)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Authentication](#-authentication)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ Features

### 🔐 **Authentication & User Management**
- **Multi-Authentication Support**: Email/password and Google OAuth 2.0
- **Smart Profile Completion**: Guided onboarding for Google OAuth users
- **Display Names**: Professional profiles with real names and unique usernames
- **Password Security**: Bcrypt hashing with strength validation
- **Remember Me**: Persistent sessions with secure token storage
- **Password Reset**: Email-based password recovery flow

### 👤 **User Profiles & Social Features**
- **Rich Profiles**: Display names, bios, profile pictures, and statistics
- **Follow System**: Follow/unfollow users with real-time counts
- **User Discovery**: Advanced search by username, display name, or email
- **Profile Completion Tracking**: Ensures complete user profiles
- **User Suggestions**: Intelligent user recommendations

### 📸 **Content Management**
- **Multi-Media Posts**: Support for images with captions
- **Cloudinary Integration**: Professional image hosting and optimization
- **Real-time Interactions**: Likes and comments with live counts
- **Post Discovery**: Explore feed for discovering new content
- **Saved Posts**: Bookmark favorite posts for later viewing

### 🎨 **User Experience**
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Smooth animations and loading indicators
- **Error Handling**: Comprehensive error management with user-friendly messages
- **Progressive Enhancement**: Works offline with cached data

### 🛡️ **Security & Performance**
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for production security
- **Input Validation**: Client and server-side validation
- **Rate Limiting**: Protection against abuse
- **Image Optimization**: Automatic image compression and resizing

### 👨‍💼 **Admin Features**
- **Admin Dashboard**: Complete platform management
- **User Management**: View and manage user accounts
- **Content Moderation**: Monitor posts and comments
- **Analytics**: Platform usage statistics

## 🛠️ Tech Stack

### **Frontend**
```json
{
  "framework": "React 18.3.1",
  "routing": "React Router DOM 7.4.1",
  "styling": "Tailwind CSS 4.0.0",
  "build_tool": "Vite 6.0.5",
  "icons": "Lucide React + Heroicons",
  "http_client": "Axios + Fetch API",
  "authentication": "Google Identity Services"
}
```

### **Backend**
```json
{
  "runtime": "Node.js",
  "framework": "Express.js 4.21.2",
  "database": "MongoDB with Mongoose 8.13.1",
  "authentication": "JWT + Passport.js",
  "file_storage": "Cloudinary",
  "security": "bcryptjs + CORS",
  "session_management": "express-session"
}
```

### **Infrastructure**
```json
{
  "frontend_hosting": "Vercel",
  "backend_hosting": "Render",
  "database": "MongoDB Atlas",
  "cdn": "Cloudinary",
  "domain": "Custom domains configured"
}
```

## 🏗️ Architecture

### **System Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (Node/Express)│◄──►│   (MongoDB)     │
│   Vercel        │    │   Render        │    │   Atlas         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Assets    │    │   File Storage  │    │   External APIs │
│   Cloudinary    │    │   Cloudinary    │    │   Google OAuth  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Architecture**
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Input, Toast, etc.)
│   ├── PostCard.jsx    # Post display components
│   ├── Navbar.jsx      # Navigation
│   └── Sidebar.jsx     # Side navigation
├── pages/              # Route components
│   ├── Home.jsx        # Main feed
│   ├── Login.jsx       # Authentication
│   ├── Profile.jsx     # User profiles
│   └── Explore.jsx     # Content discovery
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   └── ToastContext.jsx# Notification system
├── services/           # API communication
│   ├── authService.js  # Authentication API
│   └── googleAuthService.js # Google OAuth
├── utils/              # Utility functions
│   ├── validation.js   # Form validation
│   └── imageUtils.js   # Image processing
└── config/             # Configuration
    └── api.js          # API endpoints
```

### **Backend Architecture**
```
backend/
├── models/             # Database schemas
│   ├── User.js         # User model
│   ├── Post.js         # Post model
│   ├── Comment.js      # Comment model
│   └── Follow.js       # Follow relationship
├── routes/             # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── user.js         # User management
│   ├── post.js         # Post operations
│   └── follow.js       # Social features
├── middleware/         # Custom middleware
│   ├── auth.js         # JWT verification
│   ├── cloudinaryUpload.js # File upload
│   └── admin.js        # Admin protection
├── config/             # Configuration
│   ├── db.js           # Database connection
│   └── cloudinary.js   # File storage config
└── utils/              # Utility functions
    └── responseFormatter.js # API responses
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB Atlas account
- Cloudinary account
- Google Cloud Console project (for OAuth)

### **Environment Variables**

#### **Backend (.env)**
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fashion-community

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=development
```

#### **Frontend (.env.local)**
```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### **Installation & Setup**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/fashion-community.git
cd fashion-community
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your values
```

4. **Start development servers**
```bash
# Terminal 1: Start backend (from root)
npm run start

# Terminal 2: Start frontend (from root)
cd frontend && npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/

### **Google OAuth Setup**

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project: "Fashion Community"

2. **Configure OAuth Consent Screen**
   - Add app name, support email, developer contact
   - Add scopes: `email`, `profile`, `openid`

3. **Create OAuth 2.0 Credentials**
   - Application type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:5173` (development)
     - `https://fashion-community-mguq.vercel.app` (production)
   - Authorized redirect URIs: Same as above

4. **Update environment variables**
   - Copy Client ID to `VITE_GOOGLE_CLIENT_ID`

## 📚 API Documentation

### **Authentication Endpoints**

#### **POST /api/auth/register**
Register a new user account.
```json
{
  "username": "johndoe123",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### **POST /api/auth/login**
Authenticate user and receive JWT token.
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

#### **POST /api/auth/google**
Authenticate with Google OAuth.
```json
{
  "idToken": "google-jwt-token",
  "email": "john@gmail.com",
  "name": "John Doe",
  "firstName": "John",
  "lastName": "Doe",
  "imageUrl": "https://...",
  "googleId": "google-user-id"
}
```

### **User Endpoints**

#### **GET /api/users/:id/profile**
Get user profile with statistics.
```json
{
  "_id": "user-id",
  "username": "johndoe123",
  "displayName": "John Doe",
  "email": "john@example.com",
  "profilePicture": "https://...",
  "bio": "Fashion enthusiast",
  "stats": {
    "posts": 25,
    "followers": 150,
    "following": 89
  },
  "isFollowing": false,
  "isOwnProfile": false
}
```

#### **PUT /api/users/profile**
Update user profile (requires authentication).
```json
{
  "username": "newusername",
  "displayName": "New Display Name",
  "bio": "Updated bio"
}
```

### **Post Endpoints**

#### **GET /api/posts/feed**
Get personalized feed (requires authentication).
```json
[
  {
    "_id": "post-id",
    "userId": {
      "_id": "user-id",
      "username": "johndoe123",
      "displayName": "John Doe",
      "profilePicture": "https://..."
    },
    "caption": "Great outfit for today!",
    "media": [
      {
        "url": "https://...",
        "type": "image",
        "publicId": "cloudinary-id"
      }
    ],
    "likeCount": 42,
    "commentCount": 8,
    "timestamp": "2024-01-15T10:30:00Z"
  }
]
```

#### **POST /api/posts**
Create a new post (requires authentication).
```json
{
  "caption": "Check out my new outfit!",
  "media": ["file-upload"]
}
```

### **Social Endpoints**

#### **POST /api/follows/:userId**
Follow a user (requires authentication).

#### **DELETE /api/follows/:userId**
Unfollow a user (requires authentication).

#### **GET /api/follows/:userId/followers**
Get user's followers list.

#### **GET /api/follows/:userId/following**
Get user's following list.

## 🗄️ Database Schema

### **User Model**
```javascript
{
  username: String,           // Unique identifier
  displayName: String,        // Public display name
  email: String,             // Contact/login email
  password: String,          // Bcrypt hashed
  profilePicture: String,    // Cloudinary URL
  profilePicturePublicId: String, // For deletion
  bio: String,               // User description
  role: String,              // 'user' | 'admin'
  savedPosts: [ObjectId],    // Bookmarked posts
  googleId: String,          // Google OAuth ID
  isGoogleUser: Boolean,     // OAuth flag
  profileCompleted: Boolean, // Setup completion
  timestamps: true
}
```

### **Post Model**
```javascript
{
  userId: ObjectId,          // Author reference
  caption: String,           // Post description
  media: [{
    url: String,             // Cloudinary URL
    publicId: String,        // For deletion
    type: String             // 'image' | 'video'
  }],
  likeCount: Number,         // Cached count
  commentCount: Number,      // Cached count
  timestamp: Date
}
```

### **Follow Model**
```javascript
{
  follower: ObjectId,        // User who follows
  following: ObjectId,       // User being followed
  timestamp: Date
}
```

### **Comment Model**
```javascript
{
  postId: ObjectId,          // Post reference
  userId: ObjectId,          // Author reference
  content: String,           // Comment text
  timestamp: Date
}
```

## 🔐 Authentication

### **JWT Token Structure**
```javascript
{
  "id": "user-mongodb-id",
  "iat": 1640995200,         // Issued at
  "exp": 1641600000          // Expires (7 days)
}
```

### **Authentication Flow**

1. **Registration/Login**
   - User provides credentials
   - Server validates and creates JWT
   - Token stored in localStorage/sessionStorage
   - User data cached locally

2. **Google OAuth**
   - User clicks "Sign in with Google"
   - Google Identity Services handles OAuth
   - Server receives Google ID token
   - Creates/links user account
   - Issues JWT token

3. **Protected Routes**
   - Frontend checks token existence
   - Backend validates JWT on each request
   - Automatic token refresh on expiry

### **Security Features**
- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- CORS protection for production
- Input validation and sanitization
- Rate limiting on authentication endpoints

## 🚀 Deployment

### **Frontend (Vercel)**

1. **Connect Repository**
   - Link GitHub repository to Vercel
   - Configure build settings

2. **Environment Variables**
   ```env
   VITE_API_URL=https://fashion-community-backend.onrender.com
   VITE_GOOGLE_CLIENT_ID=your-production-client-id
   ```

3. **Build Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

### **Backend (Render)**

1. **Create Web Service**
   - Connect GitHub repository
   - Select backend folder

2. **Environment Variables**
   ```env
   NODE_ENV=production
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=production-secret
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

3. **Build Settings**
   ```yaml
   buildCommand: npm install --legacy-peer-deps
   startCommand: npm start
   ```

### **Database (MongoDB Atlas)**

1. **Create Cluster**
   - Choose cloud provider and region
   - Configure security settings

2. **Network Access**
   - Add IP whitelist: `0.0.0.0/0` (all IPs)
   - Configure VPC peering if needed

3. **Database User**
   - Create database user with read/write permissions
   - Generate secure password

## 🧪 Testing

### **Frontend Testing**
```bash
cd frontend
npm run lint          # ESLint checks
npm run build         # Production build test
```

### **Backend Testing**
```bash
cd backend
npm run dev           # Development server
node scripts/verifyDatabase.js  # Database verification
```

### **API Testing**
```bash
# Health check
curl https://fashion-community-backend.onrender.com/health

# Authentication test
curl -X POST https://fashion-community-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📈 Performance Optimizations

### **Frontend**
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: Cloudinary automatic optimization
- **Caching**: Service worker for offline functionality
- **Bundle Size**: Tree shaking and minification

### **Backend**
- **Database Indexing**: Optimized queries on user fields
- **Response Caching**: Static asset caching
- **Connection Pooling**: MongoDB connection optimization
- **Compression**: Gzip compression for responses

### **Infrastructure**
- **CDN**: Cloudinary global CDN for images
- **Edge Deployment**: Vercel edge functions
- **Database Optimization**: MongoDB Atlas performance insights

## 🔧 Development Tools

### **Code Quality**
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks

### **Development**
- **Nodemon**: Backend auto-restart
- **Vite HMR**: Frontend hot module replacement
- **React DevTools**: Component debugging

### **Monitoring**
- **Console Logging**: Structured logging
- **Error Tracking**: Client and server error handling
- **Performance Monitoring**: Core Web Vitals tracking

## 🤝 Contributing

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and test**
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push and create Pull Request**

### **Code Standards**
- Follow ESLint configuration
- Use TypeScript for new components
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### **Pull Request Process**
1. Update README if needed
2. Ensure all tests pass
3. Request review from maintainers
4. Address feedback promptly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Vercel** for seamless deployment
- **MongoDB** for reliable database hosting
- **Cloudinary** for image optimization
- **Google** for OAuth services
- **Tailwind CSS** for beautiful styling

## 📞 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

---

**Built with ❤️ for the fashion community**

*Fashion Community - Where style meets technology*
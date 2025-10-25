# 👗 Fashion Community

> Full-stack social media platform for fashion enthusiasts. Share style, discover trends, connect with fellow fashion lovers.

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Live](https://img.shields.io/badge/Status-Live-success)](https://fashion-community-mguq.vercel.app)

**Live:** [fashion-community-mguq.vercel.app](https://fashion-community-mguq.vercel.app) | **API:** [Backend](https://fashion-community-backend.onrender.com)

## Features

🔐 Email & Google OAuth login • 👤 User profiles & follow system • 📸 Multi-media posts with Cloudinary • ❤️ Likes & comments • 🔖 Save posts • 🎨 Responsive Tailwind UI • 🛡️ JWT auth & security • 👨‍💼 Admin dashboard

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router 7  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Passport  
**Services:** Cloudinary (images), Google OAuth, MongoDB Atlas  
**Hosting:** Vercel (frontend), Render (backend)

## Architecture

```
React (Vercel) ←→ Express API (Render) ←→ MongoDB Atlas
       ↓                  ↓                    
  Cloudinary CDN    Google OAuth
```

## Quick Start

### Prerequisites
Node.js 18+, MongoDB Atlas, Cloudinary, Google Cloud project

### Setup

```bash
# 1. Clone & install
git clone <repo-url> && cd fashion-community
npm install
cd backend && npm install
cd ../frontend && npm install

# 2. Configure environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
# Edit with your credentials

# 3. Run (2 terminals)
npm run start        # Backend (port 5000)
cd frontend && npm run dev  # Frontend (port 5173)
```

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/fashion-community
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=5000
```

**Frontend (.env.local):**
```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Google OAuth Setup

1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. Configure OAuth consent screen (scopes: email, profile, openid)
3. Create OAuth 2.0 credentials (Web application)
4. Add authorized origins: `http://localhost:5173`, `https://your-domain.com`
5. Copy Client ID to `VITE_GOOGLE_CLIENT_ID`

## API Endpoints

**Authentication:**
```bash
POST /api/auth/register     # Create account
POST /api/auth/login        # Login with email/password
POST /api/auth/google       # Login with Google OAuth
```

**Users:**
```bash
GET  /api/users/:id/profile # Get profile with stats
PUT  /api/users/profile     # Update profile (auth required)
GET  /api/users/search?q=   # Search users
```

**Posts:**
```bash
GET  /api/posts/feed        # Get personalized feed (auth)
POST /api/posts             # Create post with media (auth)
POST /api/posts/:id/like    # Like/unlike post (auth)
POST /api/posts/:id/comment # Add comment (auth)
```

**Social:**
```bash
POST   /api/follows/:userId        # Follow user (auth)
DELETE /api/follows/:userId        # Unfollow user (auth)
GET    /api/follows/:userId/followers  # Get followers
GET    /api/follows/:userId/following  # Get following
```

## Database Schema

**User:** `username`, `displayName`, `email`, `password`, `profilePicture`, `bio`, `role`, `savedPosts`, `googleId`

**Post:** `userId`, `caption`, `media[]` (url, publicId, type), `likeCount`, `commentCount`, `timestamp`

**Follow:** `follower`, `following`, `timestamp`

**Comment:** `postId`, `userId`, `content`, `timestamp`

## Project Structure

```
frontend/
├── src/
│   ├── components/     # UI components (Navbar, PostCard, etc.)
│   ├── pages/         # Routes (Home, Profile, Explore, etc.)
│   ├── context/       # Auth & Toast contexts
│   ├── services/      # API calls
│   └── utils/         # Validation & helpers

backend/
├── models/            # Mongoose schemas
├── routes/            # API endpoints
├── middleware/        # Auth, upload, admin
└── config/            # DB & Cloudinary setup
```

## Deployment

### Vercel (Frontend)

```bash
# Build settings
Build Command: npm run build
Output Directory: dist
Install Command: npm install

# Environment variables
VITE_API_URL=https://your-backend.onrender.com
VITE_GOOGLE_CLIENT_ID=production-client-id
```

### Render (Backend)

```bash
# Build settings
Build Command: npm install --legacy-peer-deps
Start Command: npm start

# Environment variables (add all from .env)
NODE_ENV=production
```

### MongoDB Atlas

1. Create cluster → Configure network access (0.0.0.0/0)
2. Create database user → Copy connection string to `MONGO_URI`

## Testing

```bash
# Frontend
cd frontend && npm run lint && npm run build

# Backend
cd backend && npm run dev

# API health check
curl https://your-backend.onrender.com/health
```

## Security Features

- Bcrypt password hashing (10 rounds)
- JWT tokens (7-day expiration)
- CORS protection
- Input validation & sanitization
- Rate limiting on auth endpoints

## Contributing

1. Fork repo → Create branch (`feature/amazing-feature`)
2. Make changes → Commit (`feat: add feature`)
3. Push → Open Pull Request

Follow ESLint config, write meaningful commits, update docs.

## License

MIT License - see [LICENSE](LICENSE)

---

**Built with ❤️ for the fashion community**
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Updates from "./pages/Updates.jsx";
import Profile from "./pages/ProfilePage.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Explore from "./pages/Explore.jsx";
import PostCreation from "./pages/PostCreation.jsx";
import Login from "./pages/LoginModern.jsx";
import Signup from "./pages/Signup.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import './index.css';
import './App.css';
import Admin from "./pages/Admin.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";

export default function App() {

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      
      {/* Protected routes */}
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/updates" element={<ProtectedRoute><Updates /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
      <Route path="/post-creation" element={<ProtectedRoute><PostCreation /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
    </Routes>
  );
}

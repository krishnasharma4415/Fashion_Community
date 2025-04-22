import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Updates from "./pages/Updates.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Explore from "./pages/Explore.jsx";
import PostCreation from "./pages/PostCreation.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import './index.css';
import './App.css';
import Admin from "./pages/Admin.jsx";
import EditProfile from "./pages/EditProfile.jsx";

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post-creation" element={<PostCreation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
}

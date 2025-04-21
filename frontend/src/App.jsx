<<<<<<< HEAD
import { Routes, Route } from 'react-router-dom';
=======
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
>>>>>>> 488586a4e106d07ea747b4ccfbd49832c2194c19
import Home from "./pages/Home.jsx";
import Updates from "./pages/Updates.jsx"; 
import Profile from "./pages/ProfilePage.jsx";
import Explore from "./pages/Explore.jsx";
<<<<<<< HEAD
import PostCreation from "./pages/PostCreation.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
=======
import SearchAndFilters  from "./Components/SearchAndFilters.jsx";
import UpdateCard from "./Components/UpdateCard.jsx"; 
import PostCreation from "./pages/PostCreation.jsx";  
import { AuthProvider } from "./context/AuthContext";
>>>>>>> 488586a4e106d07ea747b4ccfbd49832c2194c19
import './index.css';
import './App.css';

export default function App() {

  return (
<<<<<<< HEAD
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/home" element={<Home />} />
      <Route path="/post-creation" element={<PostCreation />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
=======
    
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/Sidebar" element={<Sidebar />} />
        <Route path="/PostCard" element={<PostCard />} />
        <Route path="/Suggestions" element={<Suggestions />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Explore" element={<Explore />} />
        <Route path="/SearchAndFilters" element={<SearchAndFilters />} />
        <Route path="/UpdateCard" element={<UpdateCard />} />
        <Route path="/PostCreation" element={<PostCreation />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
    </AuthProvider>
    
>>>>>>> 488586a4e106d07ea747b4ccfbd49832c2194c19
  );
}

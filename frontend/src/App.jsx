
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home.jsx";
import Updates from "./pages/Updates.jsx"; 
import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";
import PostCard from "./Components/PostCard.jsx";
import Suggestions from "./Components/Suggestions.jsx";
import Profile from "./pages/ProfilePage.jsx";
import Explore from "./pages/Explore.jsx";
import SearchAndFilters  from "./Components/SearchAndFilters.jsx";
import UpdateCard from "./Components/UpdateCard.jsx"; 
import PostCreation from "./pages/PostCreation.jsx"; 
import './index.css';
import './App.css'; // Import your CSS file here

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
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
  );
} 


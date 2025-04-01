import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Search from "./pages/Search";
import EditProfile from "./pages/EditProfile";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Footer from "./components/Footer";
import PostDetails from "./pages/PostDetails";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>  
      <Route path="/" element={<Home />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/search" element={<Search />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/login" element={<Login />} />
      <Route path="/explore" element={<Explore />} />
      <Route path ="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/post/:id" element={<PostDetails />} />
    </Routes>
    <Footer />

    </>
  );
};

export default App;
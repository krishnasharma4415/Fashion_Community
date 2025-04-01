import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
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
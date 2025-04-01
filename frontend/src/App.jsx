import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import Explore from "./pages/Explore";
import Footer from "./components/Footer";
import Marketplace from "./pages/Marketplace";
import PostDetails from "./pages/PostDetails";
import ProtectedRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <>
    <Navbar />
    <Routes>  
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/explore" element={<Explore />} />
      <Route path ="/home" element={<Home />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/post/:id" element={<PostDetails />} />
    </Routes>
    <Footer />

    </>
  );
};

export default App;
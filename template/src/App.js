import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";
import Marketplace from "./pages/Marketplace";
import PostDetails from "./pages/PostDetails";
import { AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/explore" element={<Explore />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/post/:id" element={<PostDetails />} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
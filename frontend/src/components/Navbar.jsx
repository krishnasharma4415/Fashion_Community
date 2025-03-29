// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiHeart, FiUser } from "react-icons/fi";

const Navbar = () => {
    return (
        <nav className="flex justify-between p-4 bg-white shadow-md fixed w-full top-0 z-10">
            <Link to="/" className="text-xl font-bold">FashionHub</Link>
            <div className="flex space-x-4">
                <FiSearch className="text-xl cursor-pointer" />
                <FiHeart className="text-xl cursor-pointer" />
                <Link to="/profile/1">
                    <FiUser className="text-xl cursor-pointer" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
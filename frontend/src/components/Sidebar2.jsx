import { useState } from "react";
import {
  FaHome,
  FaCompass,
  FaPlusSquare,
  FaBell,
  FaBars,
} from "react-icons/fa";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`h-screen bg-[#f2ecf9] text-black flex flex-col justify-between transition-all duration-300 ${
        isOpen ? "w-48" : "w-16"
      }`}
    >
      <div className="flex flex-col items-start py-8 px-4 space-y-6">
        {/* Home */}
        <div className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer">
          <div className="text-xl">
            <FaHome />
          </div>
          {isOpen && <span className="text-sm font-medium">Home</span>}
        </div>
         
        {/* Explore */}
        <Link to ={"/Explore"} >
        <div className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer">
          <div className="text-xl">
            <FaCompass />
          </div>
          {isOpen && <span className="text-sm font-medium">Explore</span>}
        </div>
        </Link>

        {/* New Post */}
        <div className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer">
          <div className="text-xl">
            <FaPlusSquare />
          </div>
          {isOpen && <span className="text-sm font-medium">New Post</span>}
        </div>

        {/* Updates */}
        <div className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer">
          <div className="text-xl">
            <FaBell />
          </div>
          {isOpen && <span className="text-sm font-medium">Updates</span>}
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer mt-4">
          <img
            src="https://randomuser.me/api/portraits/women/75.jpg"
            alt="Profile"
            className="w-6 h-6 rounded-full"
          />
          {isOpen && <span className="text-sm font-medium">Profile</span>}
        </div>
      </div>

      {/* Hamburger Toggle */}
      <div
        className="p-4 text-xl hover:text-purple-600 cursor-pointer"
        onClick={toggleSidebar}
      >
        <FaBars />
      </div>
    </div>
  );
}

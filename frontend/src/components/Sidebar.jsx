import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCompass, FaPlusSquare, FaBell, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/home" },
    { icon: <FaCompass />, label: "Explore", path: "/Explore" },
    { icon: <FaPlusSquare />, label: "New Post", path: "/post-creation" },
    { icon: <FaBell />, label: "Updates", path: "/Updates" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full bg-[#f2ecf9] text-black z-40 transition-all duration-300 ease-in-out border-r border-white/30
        ${isOpen ? "w-56" : "w-0"} 
        md:static md:flex md:flex-col md:w-56 
        overflow-hidden md:overflow-visible`}
        role="navigation"
      >
        <div className="flex flex-col py-8 px-6 space-y-2 flex-grow">
          {navItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="group flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white/50 hover:text-[#8c9cc8] cursor-pointer transition-all duration-200 hover:shadow-sm"
            >
              <div className="text-xl text-[#8c9cc8] group-hover:text-[#8c9cc8]">{item.icon}</div>
              {isOpen && <span className="text-sm font-semibold">{item.label}</span>}
            </Link>
          ))}

          {/* Divider */}
          <div className="my-4 h-px bg-gradient-to-r from-transparent via-[#e0d7f9] to-transparent"></div>

          <Link to="/profile">
            <div className="group flex items-center space-x-4 px-4 py-3 rounded-xl hover:bg-white/50 hover:text-[#8c9cc8] cursor-pointer transition-all duration-200 hover:shadow-sm">
              <div className="relative">
                <img
                  src="https://i.pinimg.com/736x/83/05/bc/8305bcc8d0e550be62f69b111635b7f5.jpg"
                  alt="Profile"
                  className="w-8 h-8 rounded-full border-2 border-[#e0d7f9] group-hover:border-[#9fb3df] transition-colors duration-200"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Profile</span>
                  <span className="text-xs text-gray-500">View your profile</span>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Footer for mobile */}
        <div className="md:hidden p-4 bg-[#e0d7f9]/50 backdrop-blur-sm border-t border-white/30">
          <button 
            onClick={toggleSidebar} 
            aria-label="Toggle sidebar" 
            className="w-full flex justify-center items-center text-[#8c9cc8] hover:text-[#8c9cc8] transition-colors duration-200 p-2 rounded-lg hover:bg-white/30"
          >
            <FaBars className="text-xl" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

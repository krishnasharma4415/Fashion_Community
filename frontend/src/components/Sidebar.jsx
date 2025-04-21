import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCompass, FaPlusSquare, FaBell, FaBars } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navItems = [
    { icon: <FaHome />, label: "Home", path: "/" },
    { icon: <FaCompass />, label: "Explore", path: "/Explore" },
    { icon: <FaPlusSquare />, label: "New Post", path: "/PostCreation" },
    { icon: <FaBell />, label: "Updates", path: "/Updates" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-[#f2ecf9] text-black z-40 transition-all duration-300 ease-in-out
        ${isOpen ? "w-48" : "w-0"} 
        md:static md:flex md:flex-col md:w-48 
        overflow-hidden md:overflow-visible`}
        role="navigation"
      >
        {/* Top section with navigation items */}
        <div className="flex flex-col items-start py-8 px-4 space-y-6 flex-grow">
          {navItems.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer"
            >
              <div className="text-xl">{item.icon}</div>
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}

          {/* Profile */}
          <Link to="/profile">
            <div className="flex items-center space-x-4 hover:text-purple-600 cursor-pointer mt-4">
              <img
                src="https://i.pinimg.com/736x/83/05/bc/8305bcc8d0e550be62f69b111635b7f5.jpg"
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
              {isOpen && <span className="text-sm font-medium">Profile</span>}
            </div>
          </Link>
        </div>

        {/* Hamburger button placed at the bottom */}
        <div className="md:hidden p-4 bg-[#e0d7f9] flex justify-center items-center">
          <button onClick={toggleSidebar} aria-label="Toggle sidebar" className="text-2xl">
            <FaBars />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import UserSearch from './UserSearch';
import { getProfilePictureUrl } from '../utils/imageUtils';
import logo from '../assets/logo.png';

import '../styles/Navbar.css';

function Navbar() {
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(userData);

    // Listen for profile updates
    const handleProfileUpdate = (event) => {
      console.log("Navbar: Profile updated, refreshing user data");
      setUser(event.detail);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);



  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login'); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-logo">
          <img 
            src={logo} 
            alt="Fashion Community" 
            className="h-12 w-15 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/home')}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="navbar-profile-btn"
            aria-label="Search Users"
          >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </button>
          
          {/* Profile Menu */}
          <div className="navbar-profile" ref={menuRef}>
            <button
              className="navbar-profile-btn"
              aria-label="Profile"
              onClick={() => setOpen((v) => !v)}
            >
              <img
                src={getProfilePictureUrl(user?.profilePicture)}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
              />
            </button>
            {open && (
              <div className="navbar-dropdown" role="menu">
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    navigate('/profile');
                  }}
                >
                  View Profile
                </button>
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    navigate('/edit-profile');
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* User Search Modal */}
      <UserSearch 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </>
  );
}

export default Navbar;

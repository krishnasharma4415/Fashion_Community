import React, { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import '../styles/Navbar.css';

function Navbar() {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setOpen(false);
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">FASHION.</div>
      <div className="navbar-profile" ref={menuRef}>
        <button
          className="navbar-profile-btn"
          aria-label="Profile"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Profile SVG icon */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 8-4 8-4s8 0 8 4" />
          </svg>
        </button>
        {open && (
          <div className="navbar-dropdown" role="menu">
            <button
              className="dropdown-item"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate('/settings'); // Navigate to the settings page
              }}
            >
              Settings
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
    </nav>
  );
}

export default Navbar;
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Perform any necessary cleanup, such as clearing user data or tokens
    navigate('/login');
  };

  return (
    <nav className="relative">
      <div className="flex justify-between items-center">
        <div className={`menu_icon_box ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
      <div className={`menu_wrapper ${isOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col space-y-4">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? 'text-black font-bold' : 'text-black'
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? 'text-black font-bold' : 'text-black'
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? 'text-black font-bold' : 'text-black'
              }
            >
              Categories
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/how-to-play"
              className={({ isActive }) =>
                isActive ? 'text-black font-bold' : 'text-black'
              }
            >
              How To Play?
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? 'text-black font-bold' : 'text-black'
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? 'text-black font-bold' : 'text-black'
              }
            >
              Contact
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-black font-bold"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
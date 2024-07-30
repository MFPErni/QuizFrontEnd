// src/components/NavigationBar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4">
        <li>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold' : 'text-white'
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold' : 'text-white'
            }
          >
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold' : 'text-white'
            }
          >
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/how-to-play"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold' : 'text-white'
            }
          >
            How To Play?
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold' : 'text-white'
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-white font-bold' : 'text-white'
            }
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
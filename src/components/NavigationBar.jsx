import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuWidth, setMenuWidth] = useState('auto');
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    if (menuRef.current) {
      const navLinks = menuRef.current.querySelectorAll('a');
      let maxWidth = 0;
      navLinks.forEach(link => {
        const linkWidth = link.offsetWidth;
        if (linkWidth > maxWidth) {
          maxWidth = linkWidth;
        }
      });
      setMenuWidth(`${maxWidth + 32}px`);
    }
  }, [isOpen]);

  return (
    <nav className="relative">
      <div className="flex justify-between items-center p-4">
        <div className={`menu_icon_box ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
          <div className="line1"></div>
          <div className="line2"></div>
          <div className="line3"></div>
        </div>
      </div>
      <div
        className={`menu_wrapper ${isOpen ? 'block' : 'hidden'}`}
        style={{ width: menuWidth }}
        ref={menuRef}
      >
        <ul className="flex flex-col space-y-4">
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
              to="/categories"
              className={({ isActive }) =>
                isActive ? 'text-white font-bold' : 'text-white'
              }
            >
              Categories
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="text-white font-bold"
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
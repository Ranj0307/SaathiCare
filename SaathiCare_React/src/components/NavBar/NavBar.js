import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaCaretDown } from 'react-icons/fa';
import './NavBar.css';

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChatbotClick = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={handleChatbotClick}>
        <img src="https://lh3.googleusercontent.com/u/0/drive-viewer/AKGpihbYUgV9yP3x10tHQ3v6MzOoLBoFEHOpEzJJqW-ToQxKk8V5jtO0ngEn_geQloM7I1CLpGcwAh4g42cfrTy_pb-veyge=w1572-h1558" alt="Logo" className="navbar-logo" />
        <span className={`navbar-heading ${isActivePath('/') ? 'active' : ''}`}>CareSaathi</span>
      </div>
      <div className="navbar-items">
        <NavLink to="/" className="nav-item" onClick={closeDropdown}>
          Care Saathi ChatBot
        </NavLink>
        <NavLink to="/optimize-lab-report" className="nav-item" onClick={closeDropdown}>
          Summarize Lab Report
        </NavLink>
        <div className="nav-item dropdown" onClick={toggleDropdown} onMouseEnter={openDropdown} onMouseLeave={closeDropdown}>
          Strategic Healthcare Analytics <FaCaretDown className="dropdown-icon"/>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <NavLink to="/image-analytics" className="dropdown-item" onClick={closeDropdown}>Image Analytics</NavLink>
              <NavLink to="/extent-prediction" className="dropdown-item" onClick={closeDropdown}>Extent Prediction and Preventive Planning</NavLink>
            </div>
          )}
        </div>
        <div className="nav-item">
          <button className="login-button">
            <FaSignInAlt className="login-icon" />
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;

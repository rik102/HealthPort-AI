import React from 'react';
import { Link } from 'react-router-dom';
import GoogleSignInButton from './GoogleSignInButton';
import './NavBar.css';

const NavBar = ({ handleGoogleSignIn }) => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="logo-link">
          <h1 className="logo-text">HealthPort AI</h1>
        </Link>
      </div>
      
      <div className="nav-links">
        <Link to="/history" className="nav-link">
          <button className="nav-button">
            <i className="fas fa-history"></i> History
          </button>
        </Link>
        <Link to="/about" className="nav-link">
          <button className="nav-button">
            <i className="fas fa-info-circle"></i> About
          </button>
        </Link>
        <div className="sign-in-wrapper">
          <GoogleSignInButton onClick={handleGoogleSignIn} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import GoogleSignInButton from './components/GoogleSignInButton';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import doctorIllustration from './assets/doctor-illustration.png';
import logoIcon from './assets/logo.png';

// Create a separate component for the main content to use the hook
const MainContent = () => {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        setUser(res.data);
        console.log('User info:', res.data);
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });

  const handleLogout = () => {
    setUser(null);
    setShowDropdown(false);
    navigate('/');
    window.location.reload();
  };

  const handleFileUpload = async (file, analysisData) => {
    try {
      if (!analysisData) {
        throw new Error('No analysis data received');
      }
      setAnalysis(analysisData);
      setError(null);
    } catch (error) {
      console.error('Error handling file upload:', error);
      setError(error.message);
      setAnalysis(null);
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <header className="app-header">
          <div className="header-content">
            
            <Link to="/" className="logo-container">
              <img src={logoIcon} alt="HealthPort AI Logo" className='logo-icon' />
              <div className='logo-text-wrapper'>
              <h1 className="logo-text">HealthPort AI</h1>
              <p className="logo-subtitle">Your AI-Powered Health Report Analyzer</p>
              </div>
            </Link>

            <div className="nav-links">
              {user && (
                <>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/history" className="nav-link">History</Link>
                </>
              )}
              <div className="signin-button-container" ref={dropdownRef}>
                {user ? (
                  <div className="user-info" onClick={() => setShowDropdown(!showDropdown)}>
                    <img src={user.picture} alt={user.name} className="user-avatar" />
                    <span className="user-name">{user.name}</span>
                    {showDropdown && (
                      <div className="dropdown-menu">
                        <button onClick={handleLogout} className="dropdown-item">Logout</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <GoogleSignInButton onClick={login} />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <section className="hero-section">
                  <div className="hero-content">
                    <div className="hero-text">
                      <h2>Transform Your Medical Reports</h2>
                      <p>Upload your medical reports and get instant, AI-powered analysis and insights.</p>
                      <div className="hero-stats">
                        <div className="stat-item">
                          <div className="stat-number">98%</div>
                          <div className="stat-label">Accuracy</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-number">24/7</div>
                          <div className="stat-label">Availability</div>
                        </div>
                        <div className="stat-item">
                          <div className="stat-number">Instant</div>
                          <div className="stat-label">Analysis</div>
                        </div>
                      </div>
                    </div>
                    <img src={doctorIllustration} alt="Doctor with medical report" className="doctor-illustration" />
                  </div>
                </section>

                <section className="upload-section">
                  {!analysis ? (
                    <UploadForm onUpload={handleFileUpload} />
                  ) : (
                    <AnalysisResults analysis={analysis} />
                  )}
                </section>


                <section className='features-section'>
                  <div className='feature-card'>
                    <h3>Understand What It Means</h3>
                    <p>From cholesterol to vitamin deficiencies, we explain what each value means and what to do next.</p>
                  </div>
                  <div className='feature-card'>
                    <h3>Keep Track Effortlessly</h3>
                    <p>Securely save your history, monitor trends over time, and get notified about concerning changes.</p>
                  </div>
                </section>

              </>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>© 2025 HealthPort AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <MainContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App; 
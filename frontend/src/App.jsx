import React, { useState } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import GoogleSignInButton from './components/GoogleSignInButton';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Create a separate component for the main content to use the hook
const MainContent = () => {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

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

        await axios.post('http://localhost:8000/user/register', {
          username: res.data.name,
          email: res.data.email,
          profile_picture: res.data.picture,
        });
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
  });

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
            <div className="logo-container">
              <h1 className="logo-text">HealthPort AI</h1>
              <p className="logo-subtitle">Your AI-Powered Health Report Analyzer</p>
            </div>
            <div className="signin-button-container">
              {user ? (
                <div className="user-info">
                  <img src={user.picture} alt={user.name} className="user-avatar" />
                  <span className="user-name">{user.name}</span>
                </div>
              ) : (
                <GoogleSignInButton onClick={login} />
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          <section className="hero-section">
            <div className="hero-text">
              <h2>Transform Your Medical Reports</h2>
              <p>Upload your medical reports and get instant, AI-powered analysis and insights.</p>
            </div>
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
          </section>

          <section className="upload-section">
            {!analysis ? (
              <UploadForm onUpload={handleFileUpload} />
            ) : (
              <AnalysisResults analysis={analysis} />
            )}
          </section>

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
      <Router>  {/* Wrap the app with Router */}
        <Routes>
          <Route path="/" element={<MainContent />} />  {/* MainContent with Google OAuth */}
          <Route path="/history" element={<History />} />  {/* History page route */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App; 
import React, { useState } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import GoogleSignInButton from './components/GoogleSignInButton';
import axios from 'axios';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    console.log('Google sign-in clicked');
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
            <div className="logo-container">
              <h1 className="logo-text">HealthPort AI</h1>
              <p className="logo-subtitle">Your AI-Powered Health Report Analyzer</p>
            </div>
            <div className="signin-button-container">
              <GoogleSignInButton onClick={handleGoogleSignIn} />
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
}

export default App; 
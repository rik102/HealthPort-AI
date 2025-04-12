import React, { useState } from 'react';
import './App.css';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import GoogleSignInButton from './components/GoogleSignInButton';
import axios from 'axios';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleGoogleSignIn = () => {
    // Implement Google sign-in logic here
    console.log('Google sign-in clicked');
  };

  const handleFileUpload = async (file) => {
    // Clear previous analysis when new file is uploaded
    setAnalysis(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analysis/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.status === 'success') {
        setAnalysis(response.data.analysis);
      } else {
        throw new Error('Failed to analyze the document');
      }
    } catch (err) {
      if (err.response) {
        throw new Error(err.response.data.detail || 'Server error occurred');
      } else if (err.request) {
        throw new Error('No response from server. Please check if the backend is running.');
      } else {
        throw new Error('Error uploading file: ' + err.message);
      }
    } finally {
      setIsUploading(false);
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
            <UploadForm onUpload={handleFileUpload} />
          </section>

          {analysis && (
            <section className="results-section">
              <AnalysisResults analysis={analysis} />
            </section>
          )}
        </main>

        <footer className="app-footer">
          <p>© 2024 HealthPort AI. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App; 
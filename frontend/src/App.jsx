import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import AboutPage from './components/About';
import HistoryPage from './components/History';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

function App() {
  const [analysis, setAnalysis] = useState(null);
  const [isUploading, setIsUploading] = useState(false);



  const handleGoogleSignIn = () => {
    console.log('Google sign-in clicked');
    // Implement Google sign-in logic here


  };

  const handleFileUpload = async (file) => {
    // Clear previous analysis when new file is uploaded
    setAnalysis(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
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
    <Router>
      <div className="app-container">
        <NavBar handleGoogleSignIn={handleGoogleSignIn} />
        
        <div className="background-animation">
          <div className="gradient-circle circle-1"></div>
          <div className="gradient-circle circle-2"></div>
          <div className="gradient-circle circle-3"></div>
        </div>

        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={
              <>
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
                    <UploadForm onUpload={handleFileUpload} isUploading={isUploading} />
                  </section>

                  {analysis && (
                    <section className="results-section">
                      <AnalysisResults analysis={analysis} />
                    </section>
                  )}
                </main>
              </>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>

          <footer className="app-footer">
            <p>© 2024 HealthPort AI. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
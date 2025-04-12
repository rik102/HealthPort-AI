import React from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = () => {
  return (
    <div className="loading-container">
      <div className="loading-circle">
        <div className="loading-circle-inner"></div>
      </div>
      <div className="loading-text">
        <div className="loading-message">Analyzing your report...</div>
      </div>
    </div>
  );
};

export default LoadingAnimation; 
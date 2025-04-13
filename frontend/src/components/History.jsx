import React from 'react';
import './History.css';

const History = () => {
  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Analysis History</h1>
        <button className="google-style-button">Export All Reports</button>
      </div>
      
      <div className="history-list">
        <div className="history-item">
          <div className="history-date">Today</div>
          <div className="history-content">
            <h3>Complete Blood Count</h3>
            <div className="history-details">
              <div className="history-status status-normal">Normal</div>
              <div className="history-summary">All values within normal range</div>
            </div>
          </div>
        </div>

        <div className="history-item">
          <div className="history-date">Yesterday</div>
          <div className="history-content">
            <h3>Metabolic Panel</h3>
            <div className="history-details">
              <div className="history-status status-high">High</div>
              <div className="history-summary">Elevated glucose levels detected</div>
            </div>
          </div>
        </div>

        <div className="history-item">
          <div className="history-date">2 days ago</div>
          <div className="history-content">
            <h3>Lipid Panel</h3>
            <div className="history-details">
              <div className="history-status status-normal">Normal</div>
              <div className="history-summary">Cholesterol levels within target range</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History; 
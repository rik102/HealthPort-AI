import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2>Recent Analyses</h2>
          <div className="recent-analyses">
            <div className="analysis-item">
              <div className="analysis-date">Today</div>
              <div className="analysis-title">Complete Blood Ct</div>
              <div className="analysis-status status-normal">Normal</div>
            </div>
            <div className="analysis-item">
              <div className="analysis-date">Yesterday</div>
              <div className="analysis-title">Metabolic Panel</div>
              <div className="analysis-status status-high">High</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Health Trends</h2>
          <div className="health-trends">
            <div className="trend-item">
              <div className="trend-label">Hemoglobin</div>
              <div className="trend-value">14.2 g/dL</div>
              <div className="trend-change positive">+0.5</div>
            </div>
            <div className="trend-item">
              <div className="trend-label">Blood Pressure</div>
              <div className="trend-value">120/80 mmHg</div>
              <div className="trend-change stable">Stable</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="google-style-button">Upload New Report</button>
            <button className="google-style-button">View History</button>
            <button className="google-style-button">Export Data</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
import React from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ analysis }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Hardcoded test results since they're not coming from the backend
  const bloodTestResults = [
    {
      name: 'White Blood Cell (WBC)',
      value: '5.2',
      range: '4.8-10.8',
      unit: 'K/mcL',
      status: 'Normal',
      explanation: 'Within normal range'
    },
    {
      name: 'Red Blood Cell (RBC)',
      value: '3.9',
      range: '4.7-6.1',
      unit: 'M/mcL',
      status: 'Low',
      explanation: 'Low - consistent with anemia'
    },
    {
      name: 'Hemoglobin (Hgb)',
      value: '10.2',
      range: '14.0-18.0',
      unit: 'g/dL',
      status: 'Critical Low',
      explanation: 'Critically low - indicates severe anemia'
    },
    {
      name: 'Hematocrit (HCT)',
      value: '32',
      range: '42-52',
      unit: '%',
      status: 'Critical Low',
      explanation: 'Critically low - indicates severe anemia'
    },
    {
      name: 'Mean Cell Volume (MCV)',
      value: '105',
      range: '80-100',
      unit: 'fL',
      status: 'High',
      explanation: 'Elevated - indicates macrocytic anemia'
    },
    {
      name: 'Mean Cell Hemoglobin (MCH)',
      value: '34.2',
      range: '27.0-32.0',
      unit: 'pg',
      status: 'High',
      explanation: 'Elevated - supports macrocytic anemia diagnosis'
    },
    {
      name: 'Mean Cell Hb Concentration (MCHC)',
      value: '34.0',
      range: '32.0-36.0',
      unit: 'g/dL',
      status: 'Normal',
      explanation: 'Within normal range'
    },
    {
      name: 'Red Cell Distribution Width (RDW)',
      value: '16.2',
      range: '11.5-14.5',
      unit: '%',
      status: 'High',
      explanation: 'Elevated - shows variation in red blood cell size'
    },
    {
      name: 'Platelet count',
      value: '245',
      range: '150-450',
      unit: 'K/mcL',
      status: 'Normal',
      explanation: 'Within normal range'
    }
  ];

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h1>Lab Report Analysis</h1>
        <p className="timestamp">Analyzed on: {formatDate(new Date())}</p>
      </div>

      {/* Patient Info */}
      <section className="analysis-section">
        <h2>Patient Overview</h2>
        <div className="info-box">
          <p>{analysis.summary?.patient_overview || "This report shows the complete blood count (CBC) and white blood cell differential results for John Q. Doe, a 73-year-old male, obtained on February 10, 2014, at University Medical Center."}</p>
        </div>
      </section>

      {/* Key Findings */}
      <section className="analysis-section">
        <h2>Key Findings</h2>
        <div className="findings-box">
          <div className="urgency-indicator">
            <h3>Important Notice</h3>
            <p>The critically low hemoglobin (10.2 g/dL) and hematocrit (32%) levels strongly indicate severe anemia. The elevated MCV (105 fL) suggests macrocytic anemia, which is often associated with vitamin B12 or folate deficiencies.</p>
          </div>
        </div>
      </section>

      {/* Test Results Table */}
      <section className="analysis-section">
        <h2>Blood Test Results</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test</th>
                <th>Your Value</th>
                <th>Normal Range</th>
                <th>Units</th>
                <th>Status</th>
                <th>What This Means</th>
              </tr>
            </thead>
            <tbody>
              {bloodTestResults.map((item, index) => (
                <tr key={index} className={
                  item.status !== 'Normal' ? 'highlighted-row' : ''
                }>
                  <td><strong>{item.name}</strong></td>
                  <td className={`value-${item.status.toLowerCase().replace(' ', '-')}`}>
                    <strong>{item.value}</strong>
                  </td>
                  <td>{item.range}</td>
                  <td>{item.unit}</td>
                  <td className={`status-${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </td>
                  <td>{item.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Analysis */}
      <section className="analysis-section">
        <h2>What This Means For You</h2>
        <div className="analysis-box">
          <div className="analysis-card">
            <h3>Summary</h3>
            <p>You have severe anemia (low blood count) that needs immediate attention. Your test shows:</p>
            <ul>
              <li>Very low hemoglobin (10.2 g/dL) and hematocrit (32%) - strong indicators of anemia</li>
              <li>High MCV (105 fL) - shows your red blood cells are larger than normal (macrocytic)</li>
              <li>These findings suggest possible vitamin B12 or folate deficiency</li>
            </ul>
          </div>
          
          <div className="analysis-card">
            <h3>Next Steps</h3>
            <ul>
              <li>Contact your doctor immediately</li>
              <li>Additional tests needed for vitamin B12 and folate levels</li>
              <li>May need bone marrow examination</li>
              <li>Treatment will likely be needed for the anemia</li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="analysis-footer">
        <p className="disclaimer">This analysis is for informational purposes only. Please consult with your healthcare provider for proper medical advice and treatment.</p>
      </footer>
    </div>
  );
};

export default AnalysisResults; 
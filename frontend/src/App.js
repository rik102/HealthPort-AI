import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import AnalysisResults from './components/AnalysisResults';
import './App.css';

function App() {
  const [analysis, setAnalysis] = useState(null);

  const handleAnalysisComplete = (analysis) => {
    setAnalysis(analysis);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>HealthPort AI</h1>
        <p>Upload your lab report for AI-powered analysis</p>
      </header>
      <main>
        <UploadForm onAnalysisComplete={handleAnalysisComplete} />
        {analysis && <AnalysisResults analysis={analysis} />}
      </main>
    </div>
  );
}

export default App;

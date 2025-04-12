import React from 'react';
import './AnalysisResults.css';

const AnalysisResults = ({ analysis }) => {
  if (!analysis) return null;

  return (
    <div className="analysis-container">
      <div className="analysis-header">
        <h2>Analysis Results</h2>
        <div className="neon-line"></div>
      </div>
      
      <div className="analysis-content">
        <section className="analysis-section">
          <h3 className="section-title">Summary of Key Findings</h3>
          <div className="section-content">
            <p>The patient, a 74-year-old male, has <span className="highlight">severe anemia</span>, as indicated by critically low Hemoglobin (Hgb) and Hematocrit (Hct) levels. The specific values reported to the doctor were Hgb 6.5 g/dL and Hct 19.5%.</p>
            <p>The anemia is <span className="highlight">macrocytic</span>, meaning the average red blood cell size (MCV) is larger than normal. The average amount of hemoglobin per red blood cell (MCH) is also high.</p>
            <p>There is significant variation in the size of the red blood cells (high RDW).</p>
            <p>The White Blood Cell (WBC) count and differential are within normal limits.</p>
            <p>The Platelet count is also within the normal range.</p>
          </div>
        </section>

        <section className="analysis-section">
          <h3 className="section-title">Values Outside Normal Ranges</h3>
          <div className="section-content">
            <div className="value-grid">
              <div className="value-item">
                <span className="value-label">Red Blood Cell (RBC) Count:</span>
                <span className="value-status low">Low</span>
              </div>
              <div className="value-item">
                <span className="value-label">Hemoglobin (Hgb):</span>
                <span className="value-status critical">6.5 g/dL</span>
                <span className="value-range">(Normal: 14.0-18.0 g/dL)</span>
              </div>
              <div className="value-item">
                <span className="value-label">Hematocrit (Hct):</span>
                <span className="value-status critical">19.5%</span>
                <span className="value-range">(Normal: 42-52%)</span>
              </div>
              <div className="value-item">
                <span className="value-label">Mean Cell Volume (MCV):</span>
                <span className="value-status high">High</span>
                <span className="value-range">(Normal: 80-100 fL)</span>
              </div>
              <div className="value-item">
                <span className="value-label">Mean Cell Hemoglobin (MCH):</span>
                <span className="value-status high">High</span>
                <span className="value-range">(Normal: 27.0-32.0 pg)</span>
              </div>
              <div className="value-item">
                <span className="value-label">Red Cell Dist Width (RDW):</span>
                <span className="value-status high">High</span>
                <span className="value-range">(Normal: 11.5-14.5%)</span>
              </div>
            </div>
          </div>
        </section>

        <section className="analysis-section">
          <h3 className="section-title">Potential Health Implications</h3>
          <div className="section-content">
            <div className="implication-item">
              <h4>Severe Anemia (Low Hgb/Hct)</h4>
              <p>This level of anemia is critical and indicates a significantly reduced capacity of the blood to carry oxygen. This can lead to symptoms like severe fatigue, weakness, shortness of breath, dizziness, pale skin, rapid heartbeat, and potentially chest pain or organ stress, especially given the patient's age. Urgent medical attention is required.</p>
            </div>
            <div className="implication-item">
              <h4>Macrocytosis (High MCV) & High MCH</h4>
              <p>Large red blood cells often suggest potential causes like Vitamin B12 deficiency, Folate deficiency, liver disease, hypothyroidism, effects of certain medications, or alcoholism. Less commonly, it can be associated with bone marrow disorders like Myelodysplastic Syndrome (MDS).</p>
            </div>
            <div className="implication-item">
              <h4>High RDW</h4>
              <p>Indicates a large variation in red blood cell sizes (anisocytosis). This is common in nutritional anemias (like B12/Folate deficiency) and can also be seen in other conditions affecting red blood cell production.</p>
            </div>
          </div>
        </section>

        <section className="analysis-section">
          <h3 className="section-title">Recommendations for Follow-up</h3>
          <div className="section-content">
            <div className="recommendation-item">
              <h4>Urgent Medical Management</h4>
              <p>The critical Hgb and Hct levels necessitate immediate medical attention, which appears to have been initiated as the results were reported to the physician. Treatment may involve addressing the underlying cause and potentially blood transfusions depending on the clinical situation and symptoms.</p>
            </div>
            <div className="recommendation-item">
              <h4>Investigate Cause of Macrocytic Anemia</h4>
              <ul className="recommendation-list">
                <li>Vitamin B12 and Folate levels</li>
                <li>Reticulocyte count</li>
                <li>Peripheral Blood Smear</li>
                <li>Liver Function Tests (LFTs)</li>
                <li>Thyroid Function Tests (TSH)</li>
                <li>Review Medications and Alcohol History</li>
                <li>Consider Further Evaluation</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="disclaimer">
          <p>Disclaimer: This analysis is based solely on the provided lab report text. It is not a substitute for professional medical advice, diagnosis, or treatment. The patient's full medical history, physical examination, and other potential test results are necessary for accurate interpretation and management by a qualified healthcare provider.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults; 
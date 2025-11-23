import React from 'react';
import '../styles/endoguard-results.css';

export default function EndoGuardResults({ results }) {
  if (!results) return null;

  const { edcExposure, hormoneHealth, overallRisk, recommendations, nextSteps } = results;

  return (
    <div className="endoguard-results">
      {/* Overall Risk Card */}
      <div className={`overall-risk-card risk-${overallRisk.level.toLowerCase()}`}>
        <div className="risk-header">
          <h2>Your Overall Risk Level: {overallRisk.level}</h2>
          <div className="risk-score-large">{overallRisk.score}/100</div>
        </div>
        <p className="risk-description">
          {overallRisk.level === 'HIGH' && 'Your assessment indicates significant hormone disruption risk. Immediate action recommended.'}
          {overallRisk.level === 'MODERATE' && 'Your assessment shows moderate risk factors. Lifestyle changes can make a significant difference.'}
          {overallRisk.level === 'LOW' && 'Your assessment shows relatively low risk. Continue healthy habits and stay informed.'}
        </p>
      </div>

      {/* EDC Exposure Section */}
      <div className="results-section">
        <h3>🧪 EDC Exposure Assessment</h3>
        
        <div className="exposure-summary">
          <div className="summary-stat">
            <div className="stat-label">Exposure Risk Score</div>
            <div className={`stat-value risk-${edcExposure.riskLevel.toLowerCase()}`}>
              {edcExposure.riskScore}/100
            </div>
            <div className="stat-level">{edcExposure.riskLevel} RISK</div>
          </div>
        </div>

        {edcExposure.riskFactors && edcExposure.riskFactors.length > 0 && (
          <div className="risk-factors">
            <h4>Key Risk Factors Identified:</h4>
            {edcExposure.riskFactors.map((factor, index) => (
              <div key={index} className="risk-factor-card">
                <div className="factor-title">⚠️ {factor.factor}</div>
                <div className="factor-impact"><strong>Impact:</strong> {factor.impact}</div>
                <div className="factor-recommendation"><strong>Action:</strong> {factor.recommendation}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hormone Health Section */}
      <div className="results-section">
        <h3>🩺 Hormone Health Analysis</h3>
        
        <div className="hormone-stats">
          <div className="stat-box">
            <div className="stat-number">{hormoneHealth.symptomCount}</div>
            <div className="stat-label">Symptoms Reported</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{hormoneHealth.symptomSeverity}/10</div>
            <div className="stat-label">Severity Level</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{hormoneHealth.systemsAffected?.length || 0}</div>
            <div className="stat-label">Systems Affected</div>
          </div>
        </div>

        {hormoneHealth.systemsAffected && hormoneHealth.systemsAffected.length > 0 && (
          <div className="systems-affected">
            <h4>Hormone Systems Showing Symptoms:</h4>
            <div className="systems-grid">
              {hormoneHealth.systemsAffected.map((system, index) => (
                <div key={index} className="system-badge">{system}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="results-section">
        <h3>💡 Personalized Recommendations</h3>
        
        {recommendations && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-item priority-${rec.priority}`}>
                <div className="rec-header">
                  <span className="rec-category">{rec.category.toUpperCase()}</span>
                  <span className={`rec-priority priority-${rec.priority}`}>{rec.priority}</span>
                </div>
                <div className="rec-text">{rec.text}</div>
                {rec.rationale && <div className="rec-rationale">Why: {rec.rationale}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p>No specific recommendations at this time. Continue healthy habits!</p>
        )}
      </div>

      {/* Next Steps Section */}
      <div className="results-section next-steps-section">
        <h3>🎯 Next Steps</h3>
        
        <div className="next-steps-list">
          {nextSteps && nextSteps.map((step, index) => (
            <div key={index} className="next-step-item">
              <div className="step-number">{index + 1}</div>
              <div className="step-content">
                <div className="step-title">{step.step}</div>
                <div className="step-action">{step.action}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <h3>Ready to Take Control of Your Hormone Health?</h3>
        <p>Get ongoing support, track your progress, and access our complete hormone wellness program.</p>
        <div className="cta-buttons">
          <button className="btn-primary">Start Your Journey ($29/month)</button>
          <button className="btn-secondary">Download Full Report (PDF)</button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="medical-disclaimer">
        <h4>⚕️ Important Medical Disclaimer</h4>
        <p>
          This assessment is for educational and informational purposes only. It is not intended to diagnose, treat, cure, or prevent any disease or medical condition. The information provided should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of information from this assessment.
        </p>
        <p>
          <strong>If you are experiencing severe symptoms or a medical emergency, seek immediate medical attention.</strong>
        </p>
      </div>
    </div>
  );
}

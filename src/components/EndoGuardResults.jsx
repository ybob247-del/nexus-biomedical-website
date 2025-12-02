import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TestRecommendations from './TestRecommendations';
import SignupPrompt from './SignupPrompt';
import SubscriptionModal from './SubscriptionModal';
import ShareableResultCard from './ShareableResultCard';
import OnboardingTour from './OnboardingTour';
import { endoGuardResultsTour } from '../config/tours';
import '../styles/endoguard-results.css';
import '../styles/tour.css';

export default function EndoGuardResults({ results }) {
  if (!results) return null;

  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [modalFeature, setModalFeature] = useState('');
  const { edcExposure, hormoneHealth, overallRisk, recommendations, testRecommendations, nextSteps } = results;

  const handleDownloadPDF = async () => {
    // Check if user has active subscription
    // For now, show subscription modal for all users
    setModalFeature('PDF report download');
    setShowSubscriptionModal(true);
    
    // TODO: After user subscribes, generate PDF:
    // setIsGeneratingPDF(true);
    // const element = document.querySelector('.endoguard-results');
    // const opt = { ... };
    // const html2pdf = (await import('html2pdf.js')).default;
    // await html2pdf().set(opt).from(element).save();
    // setIsGeneratingPDF(false);
  };

  const handlePremiumFeatureClick = (featureName) => {
    setModalFeature(featureName);
    setShowSubscriptionModal(true);
  };

  return (
    <>
    <OnboardingTour 
      tourId={endoGuardResultsTour.tourId}
      steps={endoGuardResultsTour.steps}
      autoStart={true}
    />
    <div className="endoguard-results">
      {/* Overall Risk Card */}
      <div className={`overall-risk-card risk-${overallRisk.level.toLowerCase()}`} data-tour="risk-score">
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
            <div className="stat-level" data-tour="risk-level">{edcExposure.riskLevel} RISK</div>
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

      {/* Signup Prompt for Unauthenticated Users */}
      <SignupPrompt feature="Your Complete Test Recommendations & PDF Lab Letter" />

      {/* Test Recommendations Section */}
      {testRecommendations && testRecommendations.length > 0 && (
        <TestRecommendations recommendations={testRecommendations} />
      )}

      {/* Recommendations Section */}
      <div className="results-section" data-tour="recommendations">
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
        <h3>🚀 Unlock Your Complete Hormone Health Program</h3>
        <p className="cta-subtitle">Get personalized guidance, professional reports, and ongoing support for just <strong>$49/month</strong></p>
        
        <div className="premium-features-list">
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>Unlimited assessments & progress tracking</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>Detailed test recommendations with lab letters</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>Personalized 30/60/90 day action plans</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>Provider referrals & supplement recommendations</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>Professional PDF reports & progress charts</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>Priority email support from health coaches</span>
          </div>
        </div>

        <div className="cta-buttons">
          <button 
            className="btn-primary" 
            onClick={() => handlePremiumFeatureClick('full premium access')}
          >
            Upgrade to Premium - $49/month
          </button>
          {user && (
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/compare-assessments')}
              style={{ background: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)', border: 'none' }}
            >
              📊 Compare My Assessments
            </button>
          )}
          <button 
            className="btn-secondary" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            data-tour="pdf-download"
          >
            📄 Download PDF Report
          </button>
        </div>
        
        <p className="cta-guarantee">✨ 14-day money-back guarantee • Cancel anytime</p>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        feature={modalFeature}
        platform="EndoGuard"
      />

      {/* Share Results Modal */}
      {showShareModal && (
        <ShareableResultCard 
          results={results}
          onClose={() => setShowShareModal(false)}
        />
      )}

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
    </>
  );
}

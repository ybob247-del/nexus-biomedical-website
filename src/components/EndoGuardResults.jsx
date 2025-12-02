import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <h2>{t('endoguard.results.overallRiskLevel')}: {overallRisk.level}</h2>
          <div className="risk-score-large">{overallRisk.score}/100</div>
        </div>
        <p className="risk-description">
          {t(`endoguard.results.riskDescriptions.${overallRisk.level}`)}
        </p>
      </div>

      {/* EDC Exposure Section */}
      <div className="results-section">
        <h3>{t('endoguard.results.edcExposure.title')}</h3>
        
        <div className="exposure-summary">
          <div className="summary-stat">
            <div className="stat-label">{t('endoguard.results.edcExposure.exposureRiskScore')}</div>
            <div className={`stat-value risk-${edcExposure.riskLevel.toLowerCase()}`}>
              {edcExposure.riskScore}/100
            </div>
            <div className="stat-level" data-tour="risk-level">{edcExposure.riskLevel} {t('endoguard.results.edcExposure.risk')}</div>
          </div>
        </div>

        {edcExposure.riskFactors && edcExposure.riskFactors.length > 0 && (
          <div className="risk-factors">
            <h4>{t('endoguard.results.edcExposure.keyRiskFactors')}</h4>
            {edcExposure.riskFactors.map((factor, index) => (
              <div key={index} className="risk-factor-card">
                <div className="factor-title">⚠️ {factor.factor}</div>
                <div className="factor-impact"><strong>{t('endoguard.results.edcExposure.impact')}</strong> {factor.impact}</div>
                <div className="factor-recommendation"><strong>{t('endoguard.results.edcExposure.action')}</strong> {factor.recommendation}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hormone Health Section */}
      <div className="results-section">
        <h3>{t('endoguard.results.hormoneHealth.title')}</h3>
        
        <div className="hormone-stats">
          <div className="stat-box">
            <div className="stat-number">{hormoneHealth.symptomCount}</div>
            <div className="stat-label">{t('endoguard.results.hormoneHealth.symptomsReported')}</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{hormoneHealth.symptomSeverity}/10</div>
            <div className="stat-label">{t('endoguard.results.hormoneHealth.severityLevel')}</div>
          </div>
          <div className="stat-box">
            <div className="stat-number">{hormoneHealth.systemsAffected?.length || 0}</div>
            <div className="stat-label">{t('endoguard.results.hormoneHealth.systemsAffected')}</div>
          </div>
        </div>

        {hormoneHealth.systemsAffected && hormoneHealth.systemsAffected.length > 0 && (
          <div className="systems-affected">
            <h4>{t('endoguard.results.hormoneHealth.systemsShowing')}</h4>
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
        <h3>{t('endoguard.results.recommendations.title')}</h3>
        
        {recommendations && recommendations.length > 0 ? (
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-item priority-${rec.priority}`}>
                <div className="rec-header">
                  <span className="rec-category">{rec.category.toUpperCase()}</span>
                  <span className={`rec-priority priority-${rec.priority}`}>{rec.priority}</span>
                </div>
                <div className="rec-text">{rec.text}</div>
                {rec.rationale && <div className="rec-rationale">{t('endoguard.results.recommendations.why')} {rec.rationale}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p>{t('endoguard.results.recommendations.noRecommendations')}</p>
        )}
      </div>

      {/* Next Steps Section */}
      <div className="results-section next-steps-section">
        <h3>{t('endoguard.results.nextSteps.title')}</h3>
        
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
        <h3>{t('endoguard.results.cta.title')}</h3>
        <p className="cta-subtitle">
          {t('endoguard.results.cta.subtitle')} <strong>{t('endoguard.results.cta.perMonth')}</strong>
        </p>
        
        <div className="premium-features-list">
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>{t('endoguard.results.cta.features.unlimited')}</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>{t('endoguard.results.cta.features.testRecommendations')}</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>{t('endoguard.results.cta.features.actionPlans')}</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>{t('endoguard.results.cta.features.referrals')}</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>{t('endoguard.results.cta.features.reports')}</span>
          </div>
          <div className="premium-feature">
            <span className="feature-check">✅</span>
            <span>{t('endoguard.results.cta.features.support')}</span>
          </div>
        </div>

        <div className="cta-buttons">
          <button 
            className="btn-primary" 
            onClick={() => handlePremiumFeatureClick('full premium access')}
          >
            {t('endoguard.results.cta.upgradeToPremium')}
          </button>
          {user && (
            <button 
              className="btn-secondary" 
              onClick={() => navigate('/compare-assessments')}
              style={{ background: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)', border: 'none' }}
            >
              {t('endoguard.results.cta.compareAssessments')}
            </button>
          )}
          <button 
            className="btn-secondary" 
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            data-tour="pdf-download"
          >
            {t('endoguard.results.cta.downloadPDF')}
          </button>
        </div>
        
        <p className="cta-guarantee">{t('endoguard.results.cta.guarantee')}</p>
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
        <h4>{t('endoguard.results.disclaimer.title')}</h4>
        <p>{t('endoguard.results.disclaimer.text1')}</p>
        <p><strong>{t('endoguard.results.disclaimer.text2')}</strong></p>
      </div>
    </div>
    </>
  );
}

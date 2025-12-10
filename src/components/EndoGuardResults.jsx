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
import BMIGauge from './BMIGauge';
import { exportEndoGuardPDF } from '../utils/pdfExport';
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
  const { edcExposure, hormoneHealth, overallRisk, recommendations, testRecommendations, nextSteps, aiInsights } = results;

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      // Generate professional PDF report
      const result = await exportEndoGuardPDF(results, user);
      
      if (result.success) {
        // Show success message
        console.log('PDF generated successfully:', result.fileName);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
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

      {/* AI-Powered Insights Section */}
      {aiInsights && aiInsights.symptomPattern && !aiInsights.symptomPattern.aiError && (
        <div className="results-section ai-insights-section" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '2px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            <h3 style={{ margin: 0, color: 'white' }}>AI-Powered Analysis</h3>
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>GPT-4</span>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '16px', 
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <h4 style={{ color: 'white', marginTop: 0, fontSize: '16px' }}>Identified Pattern</h4>
            <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '8px 0' }}>
              {aiInsights.symptomPattern.primaryPattern}
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.95 }}>
              {aiInsights.symptomPattern.clinicalReasoning}
            </p>
            {aiInsights.symptomPattern.confidence > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>Analysis Confidence</div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    background: 'linear-gradient(90deg, #10b981, #34d399)',
                    height: '100%',
                    width: `${aiInsights.symptomPattern.confidence * 100}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
                  {Math.round(aiInsights.symptomPattern.confidence * 100)}% confidence
                </div>
              </div>
            )}
          </div>

          {aiInsights.symptomPattern.affectedSystems && aiInsights.symptomPattern.affectedSystems.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '8px' }}>AI-Identified Hormone Systems</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {aiInsights.symptomPattern.affectedSystems.map((system, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(255,255,255,0.25)',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}>
                    {system}
                  </span>
                ))}
              </div>
            </div>
          )}

          {aiInsights.symptomPattern.redFlags && aiInsights.symptomPattern.redFlags.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '12px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚠️</span>
                <span>Important Considerations</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                {aiInsights.symptomPattern.redFlags.map((flag, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{flag}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '16px', fontStyle: 'italic' }}>
            {aiInsights.disclaimer}
          </div>
        </div>
      )}

      {/* AI-Powered Personalized Recommendations */}
      {aiInsights && aiInsights.personalizedRecommendations && !aiInsights.personalizedRecommendations.aiError && (
        <div className="results-section" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '24px' }}>💡</span>
            <h3 style={{ margin: 0 }}>AI-Personalized Action Plan</h3>
          </div>

          {aiInsights.personalizedRecommendations.lifestyle && aiInsights.personalizedRecommendations.lifestyle.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', color: '#667eea', marginBottom: '12px' }}>Lifestyle Recommendations</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {aiInsights.personalizedRecommendations.lifestyle.map((rec, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 'bold', color: '#1e293b', textTransform: 'capitalize' }}>
                        {rec.category}
                      </span>
                      <span style={{
                        background: rec.priority === 'high' ? '#fee2e2' : rec.priority === 'medium' ? '#fef3c7' : '#dbeafe',
                        color: rec.priority === 'high' ? '#991b1b' : rec.priority === 'medium' ? '#92400e' : '#1e40af',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {rec.priority}
                      </span>
                    </div>
                    <p style={{ margin: '8px 0', color: '#334155' }}>{rec.recommendation}</p>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0' }}>
                      <strong>Why:</strong> {rec.rationale}
                    </p>
                    {rec.timeframe && (
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0', fontStyle: 'italic' }}>
                        Expected results: {rec.timeframe}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiInsights.personalizedRecommendations.supplements && aiInsights.personalizedRecommendations.supplements.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', color: '#667eea', marginBottom: '12px' }}>Supplement Considerations</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {aiInsights.personalizedRecommendations.supplements.map((supp, idx) => (
                  <div key={idx} style={{
                    background: '#fefce8',
                    border: '1px solid #fde047',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#713f12', marginBottom: '4px' }}>
                      {supp.supplement} {supp.dosage && `- ${supp.dosage}`}
                    </div>
                    <p style={{ fontSize: '14px', color: '#854d0e', margin: '4px 0' }}>{supp.rationale}</p>
                    {supp.cautions && (
                      <p style={{ fontSize: '12px', color: '#a16207', marginTop: '8px', fontStyle: 'italic' }}>
                        ⚠️ {supp.cautions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiInsights.personalizedRecommendations.edcReduction && aiInsights.personalizedRecommendations.edcReduction.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', color: '#667eea', marginBottom: '12px' }}>EDC Exposure Reduction</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {aiInsights.personalizedRecommendations.edcReduction.map((action, idx) => (
                  <div key={idx} style={{
                    background: '#f0fdf4',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <span style={{ fontWeight: 'bold', color: '#14532d' }}>{action.action}</span>
                      <span style={{
                        background: action.priority === 'high' ? '#dcfce7' : '#f0fdf4',
                        color: '#166534',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}>
                        {action.priority}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#166534', margin: '8px 0 0 0' }}>{action.impact}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiInsights.personalizedRecommendations.nextSteps && aiInsights.personalizedRecommendations.nextSteps.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <h4 style={{ color: 'white', marginTop: 0, marginBottom: '12px' }}>Prioritized Action Steps</h4>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                {aiInsights.personalizedRecommendations.nextSteps.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* BMI Visualization Section */}
      {results.demographics?.bmi && (
        <div className="results-section" data-tour="bmi-indicator">
          <h3>{t('endoguard.results.bmi.title', 'Body Mass Index (BMI)')}</h3>
          <div className="bmi-container" style={{ padding: '24px 0' }}>
            <BMIGauge bmi={results.demographics.bmi} />
          </div>
          {results.demographics.bmiCategory && (
            <div style={{
              marginTop: '24px',
              padding: '20px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              borderRadius: '12px',
              border: '1px solid #cbd5e1'
            }}>
              <h4 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px' }}>
                {t('endoguard.results.bmi.healthImplication', 'Health Implications')}
              </h4>
              <p style={{ color: '#475569', marginBottom: '12px', lineHeight: '1.6' }}>
                {results.demographics.bmiCategory.healthImplication}
              </p>
              <div style={{
                background: 'white',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #3b82f6'
              }}>
                <strong style={{ color: '#1e40af' }}>
                  {t('endoguard.results.bmi.recommendation', 'Recommendation')}:
                </strong>
                <p style={{ margin: '8px 0 0 0', color: '#334155' }}>
                  {results.demographics.bmiCategory.recommendation}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

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

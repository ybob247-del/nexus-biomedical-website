import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import brand from '../config/brand';
import '../styles/test-recommendations.css';

export default function TestRecommendations({ testRecommendations }) {
  const { t } = useTranslation();
  // The consumer brand lists tests as topics to discuss, not recommendations.
  const tr = (key, options) => t(`testRecommendations.${brand.isConsumerBrand ? 'consumer' : 'nexus'}.${key}`, options);
  const [expandedCondition, setExpandedCondition] = useState(null);

  if (!testRecommendations || testRecommendations.length === 0) {
    return null;
  }

  const toggleCondition = (conditionName) => {
    setExpandedCondition(expandedCondition === conditionName ? null : conditionName);
  };

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleDownloadLabLetter = (condition) => {
    if (!isAuthenticated) {
      // Prompt user to sign up for PDF export
      if (window.confirm(tr('signupConfirm'))) {
        navigate('/signup');
      }
      return;
    }
    // TODO: Implement PDF generation for authenticated users
    alert(tr('letterComingSoon', { name: condition.name }));
  };

  return (
    <div className="test-recommendations-section">
      <div className="test-rec-header">
        <h3>{tr('title')}</h3>
        <p className="test-rec-intro">
          {tr('intro')}
        </p>
      </div>

      {testRecommendations.map((condition, index) => {
        const isExpanded = expandedCondition === condition.name;
        const essentialTests = condition.tests.filter(t => t.priority === 'essential');
        const recommendedTests = condition.tests.filter(t => t.priority === 'recommended');
        const optionalTests = condition.tests.filter(t => t.priority === 'optional');

        return (
          <div key={index} className="test-condition-card">
            <div 
              className="condition-header" 
              onClick={() => toggleCondition(condition.name)}
            >
              <div className="condition-title">
                <h4>{condition.name}</h4>
                <span className="test-count">{tr('testCount', { n: condition.tests.length })}</span>
              </div>
              <div className="condition-cost">
                <div className="cost-label">{tr('estimatedCost')}</div>
                <div className="cost-range">{condition.totalCostEssential}</div>
                <div className="cost-note">{tr('essentialOnlyNote')}</div>
              </div>
              <button className="expand-btn">
                {isExpanded ? '−' : '+'}
              </button>
            </div>

            {isExpanded && (
              <div className="condition-details">
                {/* Essential Tests */}
                {essentialTests.length > 0 && (
                  <div className="test-tier">
                    <div className="tier-header essential">
                      <span className="tier-badge">{tr('essential')}</span>
                      <span className="tier-description">{tr('essentialDesc')}</span>
                    </div>
                    <div className="test-list">
                      {essentialTests.map((test, testIndex) => (
                        <div key={testIndex} className="test-item">
                          <div className="test-header">
                            <div className="test-name">{test.name}</div>
                            <div className="test-cost">{test.cost}</div>
                          </div>
                          <div className="test-description">{test.description}</div>
                          <div className="test-rationale">
                            <strong>{tr('whyThisTest')}</strong> {test.rationale}
                          </div>
                          {test.research_pmid && (
                            <div className="test-research">
                              <a 
                                href={`https://pubmed.ncbi.nlm.nih.gov/${test.research_pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="research-link"
                              >
                                {tr('viewResearch')}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Tests */}
                {recommendedTests.length > 0 && (
                  <div className="test-tier">
                    <div className="tier-header recommended">
                      <span className="tier-badge">{tr('recommended')}</span>
                      <span className="tier-description">{tr('recommendedDesc')}</span>
                    </div>
                    <div className="test-list">
                      {recommendedTests.map((test, testIndex) => (
                        <div key={testIndex} className="test-item">
                          <div className="test-header">
                            <div className="test-name">{test.name}</div>
                            <div className="test-cost">{test.cost}</div>
                          </div>
                          <div className="test-description">{test.description}</div>
                          <div className="test-rationale">
                            <strong>{tr('whyThisTest')}</strong> {test.rationale}
                          </div>
                          {test.research_pmid && (
                            <div className="test-research">
                              <a 
                                href={`https://pubmed.ncbi.nlm.nih.gov/${test.research_pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="research-link"
                              >
                                {tr('viewResearch')}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Tests */}
                {optionalTests.length > 0 && (
                  <div className="test-tier">
                    <div className="tier-header optional">
                      <span className="tier-badge">{tr('optional')}</span>
                      <span className="tier-description">{tr('optionalDesc')}</span>
                    </div>
                    <div className="test-list">
                      {optionalTests.map((test, testIndex) => (
                        <div key={testIndex} className="test-item">
                          <div className="test-header">
                            <div className="test-name">{test.name}</div>
                            <div className="test-cost">{test.cost}</div>
                          </div>
                          <div className="test-description">{test.description}</div>
                          <div className="test-rationale">
                            <strong>{tr('whyThisTest')}</strong> {test.rationale}
                          </div>
                          {test.research_pmid && (
                            <div className="test-research">
                              <a 
                                href={`https://pubmed.ncbi.nlm.nih.gov/${test.research_pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="research-link"
                              >
                                {tr('viewResearch')}
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost Summary */}
                <div className="cost-summary">
                  <div className="cost-row">
                    <span>{tr('costEssential')}</span>
                    <strong>{condition.totalCostEssential}</strong>
                  </div>
                  <div className="cost-row">
                    <span>{tr('costAll')}</span>
                    <strong>{condition.totalCostAll}</strong>
                  </div>
                </div>

                {/* Download Button */}
                <div className="download-section">
                  <button 
                    className="download-lab-letter-btn"
                    onClick={() => handleDownloadLabLetter(condition)}
                  >
                    {tr('downloadLetter')}
                  </button>
                  <p className="download-note">
                    {tr('downloadNote')}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Important Note */}
      <div className="test-rec-disclaimer">
        <h4>{tr('importantTitle')}</h4>
        <p>
          {tr('importantText')}
        </p>
        <p>
          <strong>{tr('costNoteStrong')}</strong>{tr('costNoteRest')}
        </p>
      </div>
    </div>
  );
}

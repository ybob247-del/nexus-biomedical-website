import React, { useState } from 'react';
import '../styles/test-recommendations.css';

export default function TestRecommendations({ testRecommendations }) {
  const [expandedCondition, setExpandedCondition] = useState(null);

  if (!testRecommendations || testRecommendations.length === 0) {
    return null;
  }

  const toggleCondition = (conditionName) => {
    setExpandedCondition(expandedCondition === conditionName ? null : conditionName);
  };

  const handleDownloadLabLetter = (condition) => {
    // TODO: Implement PDF generation
    alert(`Lab request letter for ${condition.name} will be generated. This feature is coming soon!`);
  };

  return (
    <div className="test-recommendations-section">
      <div className="test-rec-header">
        <h3>🧪 Recommended Hormone Tests</h3>
        <p className="test-rec-intro">
          Based on your symptom profile, we recommend the following hormone tests. Bring this information to your healthcare provider to request these tests.
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
                <span className="test-count">{condition.tests.length} tests recommended</span>
              </div>
              <div className="condition-cost">
                <div className="cost-label">Estimated Cost</div>
                <div className="cost-range">{condition.totalCostEssential}</div>
                <div className="cost-note">(Essential tests only)</div>
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
                      <span className="tier-badge">Essential</span>
                      <span className="tier-description">Start here - most important tests</span>
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
                            <strong>Why this test:</strong> {test.rationale}
                          </div>
                          {test.research_pmid && (
                            <div className="test-research">
                              <a 
                                href={`https://pubmed.ncbi.nlm.nih.gov/${test.research_pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="research-link"
                              >
                                📚 View Research Evidence
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
                      <span className="tier-badge">Recommended</span>
                      <span className="tier-description">For comprehensive assessment</span>
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
                            <strong>Why this test:</strong> {test.rationale}
                          </div>
                          {test.research_pmid && (
                            <div className="test-research">
                              <a 
                                href={`https://pubmed.ncbi.nlm.nih.gov/${test.research_pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="research-link"
                              >
                                📚 View Research Evidence
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
                      <span className="tier-badge">Optional</span>
                      <span className="tier-description">For advanced optimization</span>
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
                            <strong>Why this test:</strong> {test.rationale}
                          </div>
                          {test.research_pmid && (
                            <div className="test-research">
                              <a 
                                href={`https://pubmed.ncbi.nlm.nih.gov/${test.research_pmid}/`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="research-link"
                              >
                                📚 View Research Evidence
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
                    <span>Essential tests only:</span>
                    <strong>{condition.totalCostEssential}</strong>
                  </div>
                  <div className="cost-row">
                    <span>All recommended tests:</span>
                    <strong>{condition.totalCostAll}</strong>
                  </div>
                </div>

                {/* Download Button */}
                <div className="download-section">
                  <button 
                    className="download-lab-letter-btn"
                    onClick={() => handleDownloadLabLetter(condition)}
                  >
                    📄 Download Lab Request Letter for Your Provider
                  </button>
                  <p className="download-note">
                    This professional letter includes the recommended tests, rationale, and research citations formatted for your healthcare provider.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Important Note */}
      <div className="test-rec-disclaimer">
        <h4>⚕️ Important Information</h4>
        <p>
          These test recommendations are based on your symptom profile and are for educational purposes only. They do not constitute medical advice. Always consult with a qualified healthcare provider before ordering any lab tests. Your provider will determine which tests are appropriate for your individual situation.
        </p>
        <p>
          <strong>Cost ranges are estimates</strong> and may vary by laboratory, insurance coverage, and geographic location. Check with your insurance provider and lab for accurate pricing.
        </p>
      </div>
    </div>
  );
}

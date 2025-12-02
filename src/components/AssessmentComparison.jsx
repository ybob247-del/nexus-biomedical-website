import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AssessmentTimeline from './AssessmentTimeline';
import '../styles/assessment-comparison.css';

export default function AssessmentComparison() {
  const { user, token } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessments, setSelectedAssessments] = useState([null, null]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      loadAssessments();
    }
  }, [user, token]);

  const loadAssessments = async () => {
    try {
      const response = await fetch('/api/endoguard/my-assessments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAssessments(data.assessments || []);
        // Auto-select most recent two assessments if available
        if (data.assessments && data.assessments.length >= 2) {
          setSelectedAssessments([data.assessments[0].id, data.assessments[1].id]);
        }
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAssessment = (index, assessmentId) => {
    const newSelected = [...selectedAssessments];
    newSelected[index] = assessmentId;
    setSelectedAssessments(newSelected);
  };

  const getAssessmentById = (id) => {
    return assessments.find(a => a.id === id);
  };

  const calculateDifference = (value1, value2) => {
    const diff = value2 - value1;
    return {
      value: Math.abs(diff),
      direction: diff > 0 ? 'increased' : diff < 0 ? 'decreased' : 'unchanged',
      percentage: value1 !== 0 ? Math.abs((diff / value1) * 100).toFixed(1) : 0
    };
  };

  if (loading) {
    return <div className="comparison-loading">Loading assessments...</div>;
  }

  if (assessments.length < 2) {
    return (
      <div className="comparison-empty">
        <h3>📊 Assessment Comparison</h3>
        <p>You need at least 2 assessments to compare progress.</p>
        <p>Complete another assessment to track your hormone health journey!</p>
      </div>
    );
  }

  const assessment1 = getAssessmentById(selectedAssessments[0]);
  const assessment2 = getAssessmentById(selectedAssessments[1]);

  return (
    <div className="assessment-comparison">
      <div className="comparison-header">
        <h2>📊 Compare Your Progress</h2>
        <p>Track changes in your hormone health over time</p>
      </div>

      {/* Timeline Chart */}
      {assessments.length >= 2 && (
        <AssessmentTimeline assessments={assessments} />
      )}

      {/* Assessment Selectors */}
      <div className="comparison-selectors">
        <div className="selector-group">
          <label>First Assessment (Baseline)</label>
          <select 
            value={selectedAssessments[0] || ''} 
            onChange={(e) => handleSelectAssessment(0, parseInt(e.target.value))}
          >
            <option value="">Select assessment...</option>
            {assessments.map(assessment => (
              <option key={assessment.id} value={assessment.id}>
                {new Date(assessment.completed_at).toLocaleDateString()} - Risk: {assessment.results?.overallRisk?.score || 'N/A'}
              </option>
            ))}
          </select>
        </div>

        <div className="comparison-arrow">→</div>

        <div className="selector-group">
          <label>Second Assessment (Current)</label>
          <select 
            value={selectedAssessments[1] || ''} 
            onChange={(e) => handleSelectAssessment(1, parseInt(e.target.value))}
          >
            <option value="">Select assessment...</option>
            {assessments.map(assessment => (
              <option key={assessment.id} value={assessment.id}>
                {new Date(assessment.completed_at).toLocaleDateString()} - Risk: {assessment.results?.overallRisk?.score || 'N/A'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {assessment1 && assessment2 && (
        <>
          {/* Overall Risk Comparison */}
          <div className="comparison-section">
            <h3>Overall Risk Score</h3>
            <div className="comparison-cards">
              <div className="comparison-card">
                <div className="card-label">Baseline</div>
                <div className={`risk-score risk-${assessment1.results?.overallRisk?.level?.toLowerCase()}`}>
                  {assessment1.results?.overallRisk?.score || 0}
                </div>
                <div className="card-date">
                  {new Date(assessment1.completed_at).toLocaleDateString()}
                </div>
              </div>

              <div className="comparison-diff">
                {(() => {
                  const diff = calculateDifference(
                    assessment1.results?.overallRisk?.score || 0,
                    assessment2.results?.overallRisk?.score || 0
                  );
                  return (
                    <div className={`diff-indicator ${diff.direction}`}>
                      {diff.direction === 'increased' && '↑'}
                      {diff.direction === 'decreased' && '↓'}
                      {diff.direction === 'unchanged' && '='}
                      <span className="diff-value">{diff.value}</span>
                      <span className="diff-percent">({diff.percentage}%)</span>
                    </div>
                  );
                })()}
              </div>

              <div className="comparison-card">
                <div className="card-label">Current</div>
                <div className={`risk-score risk-${assessment2.results?.overallRisk?.level?.toLowerCase()}`}>
                  {assessment2.results?.overallRisk?.score || 0}
                </div>
                <div className="card-date">
                  {new Date(assessment2.completed_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* EDC Exposure Comparison */}
          <div className="comparison-section">
            <h3>EDC Exposure Risk</h3>
            <div className="comparison-cards">
              <div className="comparison-card">
                <div className="card-label">Baseline</div>
                <div className="metric-value">
                  {assessment1.results?.edcExposure?.riskScore || 0}
                </div>
                <div className="metric-factors">
                  {assessment1.results?.edcExposure?.riskFactors?.length || 0} risk factors
                </div>
              </div>

              <div className="comparison-diff">
                {(() => {
                  const diff = calculateDifference(
                    assessment1.results?.edcExposure?.riskScore || 0,
                    assessment2.results?.edcExposure?.riskScore || 0
                  );
                  return (
                    <div className={`diff-indicator ${diff.direction}`}>
                      {diff.direction === 'increased' && '↑'}
                      {diff.direction === 'decreased' && '↓'}
                      {diff.direction === 'unchanged' && '='}
                      <span className="diff-value">{diff.value}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="comparison-card">
                <div className="card-label">Current</div>
                <div className="metric-value">
                  {assessment2.results?.edcExposure?.riskScore || 0}
                </div>
                <div className="metric-factors">
                  {assessment2.results?.edcExposure?.riskFactors?.length || 0} risk factors
                </div>
              </div>
            </div>
          </div>

          {/* Symptom Count Comparison */}
          <div className="comparison-section">
            <h3>Symptom Count</h3>
            <div className="comparison-cards">
              <div className="comparison-card">
                <div className="card-label">Baseline</div>
                <div className="metric-value">
                  {assessment1.results?.hormoneHealth?.symptomCount || 0}
                </div>
                <div className="metric-label">symptoms reported</div>
              </div>

              <div className="comparison-diff">
                {(() => {
                  const diff = calculateDifference(
                    assessment1.results?.hormoneHealth?.symptomCount || 0,
                    assessment2.results?.hormoneHealth?.symptomCount || 0
                  );
                  return (
                    <div className={`diff-indicator ${diff.direction}`}>
                      {diff.direction === 'increased' && '↑'}
                      {diff.direction === 'decreased' && '↓'}
                      {diff.direction === 'unchanged' && '='}
                      <span className="diff-value">{diff.value}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="comparison-card">
                <div className="card-label">Current</div>
                <div className="metric-value">
                  {assessment2.results?.hormoneHealth?.symptomCount || 0}
                </div>
                <div className="metric-label">symptoms reported</div>
              </div>
            </div>
          </div>

          {/* Hormone Systems Affected Comparison */}
          <div className="comparison-section">
            <h3>Affected Hormone Systems</h3>
            <div className="systems-comparison">
              <div className="systems-column">
                <div className="column-label">Baseline</div>
                {assessment1.results?.hormoneHealth?.systemsAffected?.map((system, index) => (
                  <div key={index} className="system-badge">{system}</div>
                )) || <div className="no-systems">No systems affected</div>}
              </div>

              <div className="systems-column">
                <div className="column-label">Current</div>
                {assessment2.results?.hormoneHealth?.systemsAffected?.map((system, index) => {
                  const wasPresent = assessment1.results?.hormoneHealth?.systemsAffected?.includes(system);
                  return (
                    <div key={index} className={`system-badge ${!wasPresent ? 'new-system' : ''}`}>
                      {system}
                      {!wasPresent && <span className="new-indicator">NEW</span>}
                    </div>
                  );
                }) || <div className="no-systems">No systems affected</div>}
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="progress-summary">
            <h3>📈 Progress Summary</h3>
            {(() => {
              const riskDiff = calculateDifference(
                assessment1.results?.overallRisk?.score || 0,
                assessment2.results?.overallRisk?.score || 0
              );
              const symptomDiff = calculateDifference(
                assessment1.results?.hormoneHealth?.symptomCount || 0,
                assessment2.results?.hormoneHealth?.symptomCount || 0
              );
              const edcDiff = calculateDifference(
                assessment1.results?.edcExposure?.riskScore || 0,
                assessment2.results?.edcExposure?.riskScore || 0
              );

              return (
                <div className="summary-content">
                  {riskDiff.direction === 'decreased' && (
                    <div className="summary-item positive">
                      ✅ Your overall risk score decreased by {riskDiff.value} points ({riskDiff.percentage}%)
                    </div>
                  )}
                  {riskDiff.direction === 'increased' && (
                    <div className="summary-item negative">
                      ⚠️ Your overall risk score increased by {riskDiff.value} points ({riskDiff.percentage}%)
                    </div>
                  )}
                  {symptomDiff.direction === 'decreased' && (
                    <div className="summary-item positive">
                      ✅ You're experiencing {symptomDiff.value} fewer symptoms
                    </div>
                  )}
                  {symptomDiff.direction === 'increased' && (
                    <div className="summary-item negative">
                      ⚠️ You're experiencing {symptomDiff.value} more symptoms
                    </div>
                  )}
                  {edcDiff.direction === 'decreased' && (
                    <div className="summary-item positive">
                      ✅ Your EDC exposure risk decreased by {edcDiff.value} points
                    </div>
                  )}
                  {edcDiff.direction === 'increased' && (
                    <div className="summary-item negative">
                      ⚠️ Your EDC exposure risk increased by {edcDiff.value} points
                    </div>
                  )}
                  {riskDiff.direction === 'unchanged' && symptomDiff.direction === 'unchanged' && (
                    <div className="summary-item neutral">
                      Your hormone health metrics remain stable
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * My Assessments Page
 * Shows user's assessment history with risk score trends
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { jsPDF } from 'jspdf';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function MyAssessments() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/my-assessments');
      return;
    }

    loadAssessments();
  }, [user, token, navigate]);

  const loadAssessments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/endoguard/my-assessments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load assessments');
      }

      setAssessments(data.assessments || []);
    } catch (err) {
      console.error('Load assessments error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 70) return { label: 'High', color: '#EF4444' };
    if (score >= 40) return { label: 'Moderate', color: '#F59E0B' };
    return { label: 'Low', color: '#10B981' };
  };

  const exportToPDF = (assessment) => {
    const doc = new jsPDF();
    const risk = getRiskLevel(assessment.riskScore);
    const date = new Date(assessment.createdAt);

    // Header
    doc.setFontSize(20);
    doc.setTextColor(0, 206, 209);
    doc.text('Nexus Biomedical Intelligence', 20, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('EndoGuard™ Assessment Report', 20, 35);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Assessment Date: ${date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 45);

    // Risk Score Box
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 55, 170, 40, 'F');
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Risk Score', 25, 65);
    
    doc.setFontSize(32);
    if (risk.label === 'High') doc.setTextColor(239, 68, 68);
    else if (risk.label === 'Moderate') doc.setTextColor(245, 158, 11);
    else doc.setTextColor(16, 185, 129);
    doc.text(assessment.riskScore.toString(), 25, 85);
    
    doc.setFontSize(14);
    doc.text(`${risk.label} Risk`, 60, 85);

    // Disclaimer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('This assessment is for informational purposes only and does not constitute medical advice.', 20, 110, { maxWidth: 170 });
    doc.text('Please consult with a qualified healthcare provider for personalized medical guidance.', 20, 120, { maxWidth: 170 });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('© ' + new Date().getFullYear() + ' Nexus Biomedical Intelligence. All rights reserved.', 20, 280);
    doc.text('Generated on ' + new Date().toLocaleDateString(), 20, 285);

    // Download
    doc.save(`EndoGuard-Assessment-${date.toISOString().split('T')[0]}.pdf`);
  };

  const chartData = {
    labels: assessments.map((a, i) => `Assessment ${i + 1}`).reverse(),
    datasets: [
      {
        label: 'Risk Score',
        data: assessments.map(a => a.riskScore).reverse(),
        borderColor: '#00CED1',
        backgroundColor: 'rgba(0, 206, 209, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#00CED1',
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#00CED1',
        borderWidth: 1,
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 206, 209, 0.2)',
            borderTop: '4px solid #00CED1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#FFFFFF', fontSize: '1.125rem' }}>Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem',
      color: '#FFFFFF'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <button
          onClick={() => navigate('/endoguard/assessment')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            padding: '0.75rem 1.5rem',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            marginBottom: '2rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          ← Back to EndoGuard
        </button>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #00CED1 0%, #FFFFFF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          My Assessment History
        </h1>

        <p style={{
          fontSize: '1.125rem',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '3rem'
        }}>
          Track your hormone health progress over time
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#FCA5A5'
          }}>
            {error}
          </div>
        )}

        {assessments.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '3rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              No Assessments Yet
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '2rem' }}>
              Take your first assessment to start tracking your hormone health
            </p>
            <button
              onClick={() => navigate('/endoguard/assessment')}
              style={{
                background: 'linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%)',
                border: 'none',
                color: '#FFFFFF',
                padding: '1rem 2rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              Take Assessment
            </button>
          </div>
        ) : (
          <>
            {/* Risk Score Trend Chart */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                Risk Score Trend
              </h2>
              <div style={{ height: '300px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>

            {/* Assessments List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {assessments.map((assessment, index) => {
                const risk = getRiskLevel(assessment.riskScore);
                const date = new Date(assessment.createdAt);

                return (
                  <div
                    key={assessment.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onClick={() => setSelectedAssessment(assessment)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                          Assessment #{assessments.length - index}
                        </h3>
                        <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: `${risk.color}20`,
                        border: `1px solid ${risk.color}`,
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: risk.color
                      }}>
                        {risk.label}
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: risk.color
                      }}>
                        {assessment.riskScore}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          height: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            width: `${assessment.riskScore}%`,
                            background: risk.color,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAssessment(assessment);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                      >
                        View Details
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportToPDF(assessment);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: 'linear-gradient(135deg, #00CED1 0%, #9F7AEA 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        📄 Export PDF
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '2rem',
            overflowY: 'auto'
          }}
          onClick={() => setSelectedAssessment(null)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedAssessment(null)}
              style={{
                float: 'right',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              ×
            </button>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              Assessment Details
            </h2>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
                Risk Score
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: getRiskLevel(selectedAssessment.riskScore).color }}>
                {selectedAssessment.riskScore}
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: getRiskLevel(selectedAssessment.riskScore).color }}>
                {getRiskLevel(selectedAssessment.riskScore).label} Risk
              </div>
            </div>

            <div style={{
              fontSize: '0.875rem',
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '1.5rem'
            }}>
              Taken on {new Date(selectedAssessment.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

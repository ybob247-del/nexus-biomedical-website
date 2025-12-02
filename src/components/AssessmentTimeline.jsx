import React, { useEffect, useRef } from 'react';
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
import { Line } from 'react-chartjs-2';

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

export default function AssessmentTimeline({ assessments }) {
  if (!assessments || assessments.length === 0) {
    return null;
  }

  // Sort assessments by date (oldest to newest)
  const sortedAssessments = [...assessments].sort(
    (a, b) => new Date(a.completed_at) - new Date(b.completed_at)
  );

  // Prepare data for chart
  const labels = sortedAssessments.map(a => 
    new Date(a.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  );

  const riskScores = sortedAssessments.map(a => a.results?.overallRisk?.score || 0);
  const edcScores = sortedAssessments.map(a => a.results?.edcExposure?.riskScore || 0);
  const symptomCounts = sortedAssessments.map(a => a.results?.hormoneHealth?.symptomCount || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Overall Risk Score',
        data: riskScores,
        borderColor: '#D946EF',
        backgroundColor: 'rgba(217, 70, 239, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#D946EF',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'EDC Exposure Risk',
        data: edcScores,
        borderColor: '#00A8CC',
        backgroundColor: 'rgba(0, 168, 204, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#00A8CC',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Symptom Count',
        data: symptomCounts,
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: {
            size: 14,
            weight: 600,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Your Health Progress Over Time',
        color: '#D946EF',
        font: {
          size: 20,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#D946EF',
        bodyColor: '#94a3b8',
        borderColor: '#D946EF',
        borderWidth: 2,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 2) {
                // Symptom count
                label += context.parsed.y + ' symptoms';
              } else {
                // Risk scores
                label += context.parsed.y + '/100';
              }
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
          callback: function(value) {
            return value + '/100';
          }
        },
        title: {
          display: true,
          text: 'Risk Score',
          color: '#94a3b8',
          font: {
            size: 14,
            weight: 600,
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
          stepSize: 1,
        },
        title: {
          display: true,
          text: 'Symptom Count',
          color: '#94a3b8',
          font: {
            size: 14,
            weight: 600,
          },
        },
      },
    },
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    }}>
      <div style={{ height: '400px' }}>
        <Line data={data} options={options} />
      </div>
      
      {/* Trend Analysis */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
      }}>
        <h3 style={{
          color: '#D946EF',
          fontSize: '1.2rem',
          marginBottom: '1rem',
          textAlign: 'center',
        }}>
          📈 Trend Analysis
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}>
          {(() => {
            const firstRisk = riskScores[0];
            const lastRisk = riskScores[riskScores.length - 1];
            const riskChange = lastRisk - firstRisk;
            const riskTrend = riskChange < 0 ? 'improving' : riskChange > 0 ? 'worsening' : 'stable';
            
            const firstEDC = edcScores[0];
            const lastEDC = edcScores[edcScores.length - 1];
            const edcChange = lastEDC - firstEDC;
            const edcTrend = edcChange < 0 ? 'improving' : edcChange > 0 ? 'worsening' : 'stable';
            
            const firstSymptoms = symptomCounts[0];
            const lastSymptoms = symptomCounts[symptomCounts.length - 1];
            const symptomChange = lastSymptoms - firstSymptoms;
            const symptomTrend = symptomChange < 0 ? 'improving' : symptomChange > 0 ? 'worsening' : 'stable';
            
            return (
              <>
                <div style={{
                  padding: '1rem',
                  background: riskTrend === 'improving' ? 'rgba(16, 185, 129, 0.15)' : riskTrend === 'worsening' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${riskTrend === 'improving' ? '#10b981' : riskTrend === 'worsening' ? '#ef4444' : '#94a3b8'}`,
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Overall Risk</div>
                  <div style={{ color: riskTrend === 'improving' ? '#10b981' : riskTrend === 'worsening' ? '#ef4444' : '#94a3b8', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {riskChange > 0 ? '+' : ''}{riskChange}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {riskTrend === 'improving' ? '✅ Improving' : riskTrend === 'worsening' ? '⚠️ Needs attention' : '➖ Stable'}
                  </div>
                </div>
                
                <div style={{
                  padding: '1rem',
                  background: edcTrend === 'improving' ? 'rgba(16, 185, 129, 0.15)' : edcTrend === 'worsening' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${edcTrend === 'improving' ? '#10b981' : edcTrend === 'worsening' ? '#ef4444' : '#94a3b8'}`,
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>EDC Exposure</div>
                  <div style={{ color: edcTrend === 'improving' ? '#10b981' : edcTrend === 'worsening' ? '#ef4444' : '#94a3b8', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {edcChange > 0 ? '+' : ''}{edcChange}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {edcTrend === 'improving' ? '✅ Improving' : edcTrend === 'worsening' ? '⚠️ Needs attention' : '➖ Stable'}
                  </div>
                </div>
                
                <div style={{
                  padding: '1rem',
                  background: symptomTrend === 'improving' ? 'rgba(16, 185, 129, 0.15)' : symptomTrend === 'worsening' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${symptomTrend === 'improving' ? '#10b981' : symptomTrend === 'worsening' ? '#ef4444' : '#94a3b8'}`,
                }}>
                  <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Symptoms</div>
                  <div style={{ color: symptomTrend === 'improving' ? '#10b981' : symptomTrend === 'worsening' ? '#ef4444' : '#94a3b8', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {symptomChange > 0 ? '+' : ''}{symptomChange}
                  </div>
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    {symptomTrend === 'improving' ? '✅ Improving' : symptomTrend === 'worsening' ? '⚠️ Needs attention' : '➖ Stable'}
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

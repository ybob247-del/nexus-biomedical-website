/**
 * Analytics Admin Dashboard
 * View key business metrics and statistics
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
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

export default function Analytics() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/admin/analytics');
      return;
    }

    loadAnalytics();
  }, [user, token, navigate]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load analytics');
      }

      setAnalytics(result.analytics);
    } catch (err) {
      console.error('Load analytics error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
        <div style={{ textAlign: 'center', color: '#FFFFFF' }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '4px solid rgba(0, 206, 209, 0.2)',
            borderTop: '4px solid #00CED1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.125rem' }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#FCA5A5', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Access Denied
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const userGrowthChartData = {
    labels: analytics.userGrowth.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'New Users',
      data: analytics.userGrowth.map(d => parseInt(d.count)),
      borderColor: '#00CED1',
      backgroundColor: 'rgba(0, 206, 209, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          stepSize: 1
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '2rem',
      color: '#FFFFFF'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}
          >
            ← Back to Home
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
                background: 'linear-gradient(135deg, #00CED1 0%, #FFFFFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Analytics Dashboard
              </h1>

              <p style={{ fontSize: '1.125rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                Track your business performance and key metrics
              </p>
            </div>

            <button
              onClick={loadAnalytics}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Total Users
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#00CED1' }}>
              {analytics.totalUsers}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Active Trials
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#9F7AEA' }}>
              {analytics.totalActiveTrials}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Paid Subscriptions
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10B981' }}>
              {analytics.totalActiveSubscriptions}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Conversion Rate
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#F59E0B' }}>
              {analytics.conversionRate}%
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            User Growth (Last 30 Days)
          </h2>
          <div style={{ height: '300px' }}>
            <Line data={userGrowthChartData} options={chartOptions} />
          </div>
        </div>

        {/* Platform Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Active Trials by Platform */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Active Trials by Platform
            </h3>
            {analytics.activeTrials.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analytics.activeTrials.map(trial => (
                  <div key={trial.platform} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{trial.platform}</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9F7AEA' }}>
                      {trial.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>No active trials</p>
            )}
          </div>

          {/* Waitlist Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>
              Waitlist Stats
            </h3>
            {analytics.waitlistStats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analytics.waitlistStats.map(stat => (
                  <div key={stat.platform}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span>{stat.platform}</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#00CED1' }}>
                        {stat.count}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                      {stat.notified_count} notified, {parseInt(stat.count) - parseInt(stat.notified_count)} pending
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'rgba(255, 255, 255, 0.5)' }}>No waitlist signups</p>
            )}
          </div>
        </div>

        {/* Additional Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              EndoGuard Assessments
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {analytics.totalAssessments}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              RxGuard Medication Lists
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {analytics.totalMedicationLists}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Total Waitlist
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {analytics.totalWaitlist}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '0.5rem' }}>
              Trial Reminders Sent
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {analytics.totalRemindersSent}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

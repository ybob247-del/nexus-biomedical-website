import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-analytics.css';

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/admin/analytics');
      return;
    }

    loadAnalytics();
  }, [user, token]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-analytics">
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-analytics">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="admin-analytics">
        <div className="error">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h1>📊 Admin Analytics Dashboard</h1>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      {/* Overview Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">👥</div>
          <div className="metric-value">{analytics.totalUsers}</div>
          <div className="metric-label">Total Users</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-value">{analytics.totalActiveTrials}</div>
          <div className="metric-label">Active Trials</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💳</div>
          <div className="metric-value">{analytics.totalActiveSubscriptions}</div>
          <div className="metric-label">Paid Subscriptions</div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📈</div>
          <div className="metric-value">{analytics.conversionRate}%</div>
          <div className="metric-label">Conversion Rate</div>
        </div>
      </div>

      {/* Revenue Metrics */}
      {analytics.revenue && (
        <div className="section">
          <h2>💰 Revenue Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">${analytics.revenue.mrr}</div>
              <div className="metric-label">Monthly Recurring Revenue (MRR)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">${analytics.revenue.arr}</div>
              <div className="metric-label">Annual Recurring Revenue (ARR)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">${analytics.revenue.arpu}</div>
              <div className="metric-label">Average Revenue Per User (ARPU)</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">
                {analytics.revenue.monthlySubs} / {analytics.revenue.yearlySubs}
              </div>
              <div className="metric-label">Monthly / Yearly Plans</div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Stats */}
      <div className="section">
        <h2>🔬 Platform Statistics</h2>
        <div className="table-container">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Active Trials</th>
                <th>Active Subscriptions</th>
              </tr>
            </thead>
            <tbody>
              {analytics.activeTrials?.map((trial) => {
                const subscription = analytics.activeSubscriptions?.find(
                  s => s.platform === trial.platform
                );
                return (
                  <tr key={trial.platform}>
                    <td className="platform-name">{trial.platform}</td>
                    <td>{trial.count}</td>
                    <td>{subscription?.count || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Distribution */}
      {analytics.engagementDistribution && analytics.engagementDistribution.length > 0 && (
        <div className="section">
          <h2>📊 Engagement Score Distribution</h2>
          <div className="chart-container">
            {analytics.engagementDistribution.map((item) => {
              const maxCount = Math.max(...analytics.engagementDistribution.map(i => parseInt(i.user_count)));
              const percentage = (parseInt(item.user_count) / maxCount) * 100;
              
              return (
                <div key={item.score_range} className="bar-chart-item">
                  <div className="bar-label">{item.score_range}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="bar-value">{item.user_count} users</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* A/B Test Results */}
      {analytics.abTestResults && analytics.abTestResults.length > 0 && (
        <div className="section">
          <h2>🧪 A/B Test Results</h2>
          <div className="table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Variant</th>
                  <th>Assigned</th>
                  <th>Conversions</th>
                  <th>Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {analytics.abTestResults.map((test, index) => (
                  <tr key={index}>
                    <td>{test.test_name}</td>
                    <td className="variant-name">{test.variant}</td>
                    <td>{test.total_assigned}</td>
                    <td>{test.conversions}</td>
                    <td className="conversion-rate">{test.conversion_rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Growth Chart */}
      {analytics.userGrowth && analytics.userGrowth.length > 0 && (
        <div className="section">
          <h2>📈 User Growth (Last 30 Days)</h2>
          <div className="chart-container">
            {analytics.userGrowth.map((day) => {
              const maxCount = Math.max(...analytics.userGrowth.map(d => parseInt(d.count)));
              const percentage = (parseInt(day.count) / maxCount) * 100;
              const date = new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              
              return (
                <div key={day.date} className="bar-chart-item">
                  <div className="bar-label">{date}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill growth-bar" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="bar-value">{day.count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="section">
        <h2>📋 Additional Statistics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{analytics.totalAssessments}</div>
            <div className="metric-label">EndoGuard Assessments</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{analytics.totalMedicationLists}</div>
            <div className="metric-label">RxGuard Medication Lists</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{analytics.totalWaitlist}</div>
            <div className="metric-label">Waitlist Signups</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{analytics.totalRemindersSent}</div>
            <div className="metric-label">Trial Reminders Sent</div>
          </div>
        </div>
      </div>
    </div>
  );
}

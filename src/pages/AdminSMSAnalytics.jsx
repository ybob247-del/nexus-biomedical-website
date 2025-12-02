import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-sms-analytics.css';

export default function AdminSMSAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is admin (owner)
    if (!user || user.open_id !== process.env.OWNER_OPEN_ID) {
      navigate('/');
      return;
    }

    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sms-analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-sms-loading">
        <div className="loading-spinner"></div>
        <p>Loading SMS analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-sms-error">
        <h2>Error Loading Analytics</h2>
        <p>{error}</p>
        <button onClick={fetchAnalytics}>Retry</button>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const {
    totalSent,
    totalDelivered,
    totalFailed,
    deliveryRate,
    campaignStats,
    recentMessages,
    costEstimate,
    healthTipsCount,
    userOptInRate
  } = analytics;

  return (
    <div className="admin-sms-analytics">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="cosmic-blob blob-1"></div>
        <div className="cosmic-blob blob-2"></div>
        <div className="cosmic-blob blob-3"></div>
      </div>

      {/* Header */}
      <div className="admin-sms-header">
        <h1>📱 SMS Notification Analytics</h1>
        <p>Real-time monitoring of SMS campaigns and delivery performance</p>
        <button onClick={() => navigate('/admin/analytics')} className="back-btn">
          ← Back to Admin Dashboard
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📤</div>
          <div className="metric-content">
            <h3>Total Sent</h3>
            <p className="metric-value">{totalSent.toLocaleString()}</p>
            <span className="metric-label">SMS messages</span>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>Delivered</h3>
            <p className="metric-value">{totalDelivered.toLocaleString()}</p>
            <span className="metric-label">{deliveryRate}% delivery rate</span>
          </div>
        </div>

        <div className="metric-card error">
          <div className="metric-icon">❌</div>
          <div className="metric-content">
            <h3>Failed</h3>
            <p className="metric-value">{totalFailed.toLocaleString()}</p>
            <span className="metric-label">Requires attention</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Estimated Cost</h3>
            <p className="metric-value">${costEstimate.toFixed(2)}</p>
            <span className="metric-label">At $0.0079/SMS</span>
          </div>
        </div>
      </div>

      {/* User Engagement */}
      <div className="engagement-section">
        <h2>📊 User Engagement</h2>
        <div className="engagement-grid">
          <div className="engagement-card">
            <h3>SMS Opt-In Rate</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${userOptInRate}%` }}
              ></div>
            </div>
            <p>{userOptInRate}% of users have SMS enabled</p>
          </div>

          <div className="engagement-card">
            <h3>Health Tips Library</h3>
            <p className="big-number">{healthTipsCount}</p>
            <p>Active health tips with citations</p>
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="campaigns-section">
        <h2>🎯 Campaign Performance</h2>
        <div className="campaigns-table">
          <table>
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Type</th>
                <th>Total Sends</th>
                <th>Delivered</th>
                <th>Failed</th>
                <th>Success Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaignStats && campaignStats.length > 0 ? (
                campaignStats.map((campaign, index) => (
                  <tr key={index}>
                    <td className="campaign-name">{campaign.campaign_name}</td>
                    <td><span className="campaign-type">{campaign.campaign_type}</span></td>
                    <td>{campaign.total_sends || 0}</td>
                    <td className="success-text">{campaign.delivered || 0}</td>
                    <td className="error-text">{campaign.failed || 0}</td>
                    <td>
                      <span className={`success-rate ${campaign.success_rate >= 90 ? 'good' : campaign.success_rate >= 70 ? 'medium' : 'poor'}`}>
                        {campaign.success_rate || 0}%
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${campaign.is_active ? 'active' : 'inactive'}`}>
                        {campaign.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No campaign data available. Campaigns will appear after first sends.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="recent-messages-section">
        <h2>📨 Recent SMS Messages</h2>
        <div className="messages-list">
          {recentMessages && recentMessages.length > 0 ? (
            recentMessages.map((message, index) => (
              <div key={index} className={`message-card ${message.status}`}>
                <div className="message-header">
                  <span className="message-type">{message.message_type}</span>
                  <span className={`message-status ${message.status}`}>
                    {message.status}
                  </span>
                </div>
                <div className="message-content">
                  <p className="message-text">{message.message_content}</p>
                  <div className="message-meta">
                    <span>To: {message.phone_number}</span>
                    <span>Sent: {new Date(message.sent_at).toLocaleString()}</span>
                    {message.twilio_message_sid && (
                      <span className="twilio-sid">SID: {message.twilio_message_sid}</span>
                    )}
                  </div>
                  {message.error_message && (
                    <p className="error-message">Error: {message.error_message}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-messages">
              <p>No SMS messages sent yet.</p>
              <p className="hint">Messages will appear here after users complete assessments or campaigns are triggered.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-btn"
            onClick={() => navigate('/admin/health-tips')}
          >
            📝 Manage Health Tips
          </button>
          <button 
            className="action-btn"
            onClick={() => window.open('https://console.twilio.com/us1/monitor/logs/sms', '_blank')}
          >
            📊 View Twilio Logs
          </button>
          <button 
            className="action-btn"
            onClick={fetchAnalytics}
          >
            🔄 Refresh Analytics
          </button>
          <button 
            className="action-btn"
            onClick={() => navigate('/settings/sms')}
          >
            ⚙️ SMS Settings
          </button>
        </div>
      </div>
    </div>
  );
}

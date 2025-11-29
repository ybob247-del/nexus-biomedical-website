import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/sms-history.css';

const SMSHistory = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSMSHistory();
  }, [user, navigate, pagination.offset]);

  const fetchSMSHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/sms-history?limit=${pagination.limit}&offset=${pagination.offset}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        setPagination(data.pagination);
        setError('');
      } else {
        setError(data.error || 'Failed to load SMS history');
      }
    } catch (err) {
      console.error('Error fetching SMS history:', err);
      setError('Failed to load SMS history. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getMessageTypeLabel = (type) => {
    const labels = {
      'assessment_reminder': 'Assessment Reminder',
      'high_risk_alert': 'High Risk Alert',
      'lab_reminder': 'Lab Test Reminder',
      'subscription_expiring': 'Subscription Expiring',
      'welcome': 'Welcome Message',
      'improvement_celebration': 'Improvement Celebration'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'sent': { class: 'status-sent', label: 'Sent' },
      'delivered': { class: 'status-delivered', label: 'Delivered' },
      'failed': { class: 'status-failed', label: 'Failed' },
      'pending': { class: 'status-pending', label: 'Pending' }
    };
    const badge = badges[status] || { class: 'status-pending', label: status };
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  const handleLoadMore = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit
    }));
  };

  const handleBackToSettings = () => {
    navigate('/settings/sms');
  };

  return (
    <div className="sms-history-page">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="cosmic-blob blob-1"></div>
        <div className="cosmic-blob blob-2"></div>
        <div className="cosmic-blob blob-3"></div>
      </div>

      <div className="sms-history-container">
        {/* Header */}
        <div className="sms-history-header">
          <button onClick={handleBackToSettings} className="back-button">
            ← Back to SMS Settings
          </button>
          <h1 className="gradient-text">SMS Message History</h1>
          <p className="subtitle">View all SMS notifications sent to your phone</p>
        </div>

        {/* Loading State */}
        {loading && messages.length === 0 && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading SMS history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchSMSHistory} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && !error && (
          <div className="empty-state">
            <div className="empty-icon">📱</div>
            <h3>No SMS Messages Yet</h3>
            <p>You haven't received any SMS notifications yet. Make sure SMS notifications are enabled in your settings.</p>
            <button onClick={handleBackToSettings} className="primary-button">
              Go to SMS Settings
            </button>
          </div>
        )}

        {/* Messages List */}
        {!loading && messages.length > 0 && (
          <>
            <div className="stats-card">
              <div className="stat-item">
                <span className="stat-label">Total Messages</span>
                <span className="stat-value">{pagination.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Showing</span>
                <span className="stat-value">{messages.length}</span>
              </div>
            </div>

            <div className="messages-list">
              {messages.map((message) => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div className="message-type">
                      {getMessageTypeLabel(message.message_type)}
                    </div>
                    {getStatusBadge(message.status)}
                  </div>

                  <div className="message-content">
                    <p>{message.message_content}</p>
                  </div>

                  <div className="message-footer">
                    <div className="message-meta">
                      <span className="meta-item">
                        <strong>To:</strong> {message.phone_number}
                      </span>
                      <span className="meta-item">
                        <strong>Sent:</strong> {formatDate(message.sent_at)}
                      </span>
                      {message.delivered_at && (
                        <span className="meta-item">
                          <strong>Delivered:</strong> {formatDate(message.delivered_at)}
                        </span>
                      )}
                    </div>

                    {message.error_message && (
                      <div className="error-details">
                        <strong>Error:</strong> {message.error_message}
                      </div>
                    )}

                    {message.twilio_message_sid && (
                      <div className="message-id">
                        <small>Message ID: {message.twilio_message_sid}</small>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {pagination.hasMore && (
              <div className="load-more-container">
                <button 
                  onClick={handleLoadMore} 
                  className="load-more-button"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More Messages'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        <div className="help-section">
          <h3>About SMS Notifications</h3>
          <ul>
            <li>All SMS messages are logged here for your records</li>
            <li>You can opt-out of SMS notifications anytime in your settings</li>
            <li>Message delivery status is tracked automatically</li>
            <li>Failed messages will show error details for troubleshooting</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SMSHistory;

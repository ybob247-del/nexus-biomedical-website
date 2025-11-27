import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/usage-stats.css';

/**
 * Usage Statistics Dashboard Component
 * Shows trial users their engagement and feature usage
 * Encourages conversion by highlighting value received
 */
export default function UsageStatsDashboard({ platform }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !platform) return;

    loadStats();
  }, [token, platform]);

  const loadStats = async () => {
    try {
      const response = await fetch(`/api/analytics/get-usage-stats?platform=${platform}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="usage-stats-dashboard loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!stats || !stats.trial) {
    return null; // Don't show for non-trial users
  }

  const { totalActions, engagementScore, actionBreakdown, trial } = stats;

  return (
    <div className="usage-stats-dashboard">
      <div className="stats-header">
        <h3>Your Trial Progress</h3>
        <div className="days-remaining">
          {trial.daysRemaining} days left
        </div>
      </div>

      <div className="stats-grid">
        {/* Engagement Score */}
        <div className="stat-card engagement-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-label">Engagement Score</div>
            <div className="stat-value">{engagementScore}/100</div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${engagementScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Actions */}
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-label">Actions Taken</div>
            <div className="stat-value">{totalActions}</div>
            <div className="stat-description">
              {totalActions > 20 ? 'Power user!' : totalActions > 10 ? 'Great progress!' : 'Keep exploring!'}
            </div>
          </div>
        </div>

        {/* Top Features */}
        {actionBreakdown && actionBreakdown.length > 0 && (
          <div className="stat-card features-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">Most Used Features</div>
              <div className="feature-list">
                {actionBreakdown.slice(0, 3).map((action, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-name">{formatActionName(action.action)}</span>
                    <span className="feature-count">{action.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Encouragement Message */}
      {engagementScore < 50 && (
        <div className="encouragement-message">
          <p>
            💡 <strong>Tip:</strong> Explore more features to get the most out of your trial!
          </p>
        </div>
      )}

      {engagementScore >= 70 && (
        <div className="upgrade-prompt">
          <p>
            🎉 You're getting great value! Continue your access for just{' '}
            <strong>{platform.toLowerCase() === 'rxguard' ? '$39/month' : '$97/month'}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

function formatActionName(action) {
  // Convert snake_case or camelCase to Title Case
  return action
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

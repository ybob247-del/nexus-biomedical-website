import React, { useState, useEffect } from 'react';
import { Download, Filter, TrendingUp, Users, Star, MessageSquare } from 'lucide-react';
import '../styles/admin-beta-feedback.css';

const AdminBetaFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackFilter, setTrackFilter] = useState('');
  const [weekFilter, setWeekFilter] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, [trackFilter, weekFilter]);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (trackFilter) params.append('track', trackFilter);
      if (weekFilter) params.append('week', weekFilter);

      const response = await fetch(`/api/admin/beta-feedback?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ export_csv: 'true' });
      if (trackFilter) params.append('track', trackFilter);
      if (weekFilter) params.append('week', weekFilter);

      const response = await fetch(`/api/admin/beta-feedback?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `beta-feedback-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  return (
    <div className="admin-beta-feedback">
      <div className="feedback-header">
        <h1>Beta Testing Feedback Dashboard</h1>
        <p>Jan 3 - Feb 28, 2026 (8 weeks)</p>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <Users size={32} color="#00A8CC" />
            <div className="stat-value">{stats.total_responses}</div>
            <div className="stat-label">Total Responses</div>
          </div>

          <div className="stat-card">
            <TrendingUp size={32} color="#00D084" />
            <div className="stat-value">{stats.avg_nps}</div>
            <div className="stat-label">Avg NPS Score</div>
          </div>

          <div className="stat-card">
            <Star size={32} color="#FFB800" />
            <div className="stat-value">{stats.avg_satisfaction}</div>
            <div className="stat-label">Avg Satisfaction</div>
          </div>

          <div className="stat-card">
            <MessageSquare size={32} color="#5B2C87" />
            <div className="stat-value">{stats.would_recommend_count}</div>
            <div className="stat-label">Would Recommend</div>
          </div>
        </div>
      )}

      {/* Mobile App Interest */}
      {stats && stats.mobile_app_interest && (
        <div className="mobile-app-stats">
          <h3>Mobile App Interest</h3>
          <div className="mobile-stats-grid">
            <div className="mobile-stat">
              <div className="mobile-stat-label">Yes, Definitely</div>
              <div className="mobile-stat-value">{stats.mobile_app_interest.yes_definitely || 0}</div>
            </div>
            <div className="mobile-stat">
              <div className="mobile-stat-label">Maybe</div>
              <div className="mobile-stat-value">{stats.mobile_app_interest.maybe || 0}</div>
            </div>
            <div className="mobile-stat">
              <div className="mobile-stat-label">No, Web is Fine</div>
              <div className="mobile-stat-value">{stats.mobile_app_interest.no_web_fine || 0}</div>
            </div>
            <div className="mobile-stat">
              <div className="mobile-stat-label">No Preference</div>
              <div className="mobile-stat-value">{stats.mobile_app_interest.no_preference || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Export */}
      <div className="feedback-controls">
        <div className="filters">
          <select 
            value={trackFilter} 
            onChange={(e) => setTrackFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Tracks</option>
            <option value="consumer_endoguard">Consumer EndoGuard</option>
            <option value="clinician_endoguard">Clinician EndoGuard</option>
            <option value="rxguard_universal">RxGuard Universal</option>
          </select>

          <select 
            value={weekFilter} 
            onChange={(e) => setWeekFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Weeks</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(week => (
              <option key={week} value={week}>Week {week}</option>
            ))}
          </select>
        </div>

        <button onClick={handleExportCSV} className="export-btn">
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Feedback List */}
      <div className="feedback-list">
        {loading ? (
          <div className="loading">Loading feedback...</div>
        ) : feedback.length === 0 ? (
          <div className="no-feedback">No feedback yet</div>
        ) : (
          feedback.map(item => (
            <div key={item.id} className="feedback-item">
              <div className="feedback-header-row">
                <div className="feedback-user">
                  <strong>{item.first_name} {item.last_name}</strong>
                  <span className="feedback-email">{item.email}</span>
                </div>
                <div className="feedback-meta">
                  {item.track && <span className="feedback-track">{item.track.replace(/_/g, ' ')}</span>}
                  {item.week_number && <span className="feedback-week">Week {item.week_number}</span>}
                  <span className="feedback-date">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="feedback-ratings">
                {item.nps_score !== null && (
                  <div className="rating-badge">
                    NPS: <strong>{item.nps_score}/10</strong>
                  </div>
                )}
                {item.overall_satisfaction && (
                  <div className="rating-badge">
                    Satisfaction: <strong>{item.overall_satisfaction}/5 ⭐</strong>
                  </div>
                )}
                {item.ease_of_use_rating && (
                  <div className="rating-badge">
                    Ease of Use: <strong>{item.ease_of_use_rating}/5</strong>
                  </div>
                )}
                {item.accuracy_rating && (
                  <div className="rating-badge">
                    Accuracy: <strong>{item.accuracy_rating}/5</strong>
                  </div>
                )}
              </div>

              {item.prefer_mobile_app && (
                <div className="mobile-preference">
                  <strong>Mobile App:</strong> {item.prefer_mobile_app.replace(/_/g, ' ')}
                  {item.mobile_platforms && item.mobile_platforms.length > 0 && (
                    <span> ({item.mobile_platforms.join(', ')})</span>
                  )}
                </div>
              )}

              {item.what_works_well && (
                <div className="feedback-text">
                  <strong>What Works Well:</strong>
                  <p>{item.what_works_well}</p>
                </div>
              )}

              {item.what_needs_improvement && (
                <div className="feedback-text">
                  <strong>Needs Improvement:</strong>
                  <p>{item.what_needs_improvement}</p>
                </div>
              )}

              {item.feature_requests && (
                <div className="feedback-text">
                  <strong>Feature Requests:</strong>
                  <p>{item.feature_requests}</p>
                </div>
              )}

              {item.testimonial && (
                <div className="feedback-testimonial">
                  <strong>💬 Testimonial:</strong>
                  <p>"{item.testimonial}"</p>
                </div>
              )}

              <div className="feedback-footer">
                {item.would_recommend !== null && (
                  <span className={item.would_recommend ? 'positive' : 'negative'}>
                    {item.would_recommend ? '✓ Would recommend' : '✗ Would not recommend'}
                  </span>
                )}
                {item.would_pay_after_beta !== null && (
                  <span className={item.would_pay_after_beta ? 'positive' : 'negative'}>
                    {item.would_pay_after_beta ? '✓ Would pay after beta' : '✗ Would not pay'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminBetaFeedback;

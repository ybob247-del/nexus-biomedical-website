import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-tour-analytics.css';

export default function AdminTourAnalytics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dateRange, setDateRange] = useState('30');
  const [selectedTour, setSelectedTour] = useState('all');
  const [error, setError] = useState(null);

  // Check admin access
  useEffect(() => {
    if (!user || user.openId !== import.meta.env.VITE_OWNER_OPEN_ID) {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch tour statistics
  useEffect(() => {
    fetchStats();
  }, [dateRange, selectedTour]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        dateRange,
        ...(selectedTour !== 'all' && { tourName: selectedTour })
      });

      const response = await fetch(`/api/analytics/tour-stats?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      setStats(data);
    } catch (err) {
      console.error('Error fetching tour stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!stats || !stats.perTour) return;

    const headers = ['Tour Name', 'Starts', 'Completions', 'Skips', 'Completion Rate (%)'];
    const rows = stats.perTour.map(tour => [
      tour.tour_name,
      tour.starts,
      tour.completions,
      tour.skips,
      tour.completion_rate || 0
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tour-analytics-${dateRange}days-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="admin-tour-analytics">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-tour-analytics">
        <div className="error-container">
          <h2>Error Loading Analytics</h2>
          <p>{error}</p>
          <button onClick={fetchStats} className="btn-retry">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tour-analytics">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="cosmic-blob blob-1"></div>
        <div className="cosmic-blob blob-2"></div>
        <div className="cosmic-blob blob-3"></div>
      </div>

      <div className="analytics-container">
        {/* Header */}
        <header className="analytics-header">
          <h1>
            <span className="gradient-text">Tour Analytics Dashboard</span>
          </h1>
          <p className="subtitle">Track user engagement with onboarding tours</p>
        </header>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Date Range:</label>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="filter-select"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tour:</label>
            <select 
              value={selectedTour} 
              onChange={(e) => setSelectedTour(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tours</option>
              {stats?.availableTours?.map(tour => (
                <option key={tour} value={tour}>{tour}</option>
              ))}
            </select>
          </div>

          <button onClick={exportToCSV} className="btn-export">
            📊 Export CSV
          </button>
        </div>

        {/* Overall Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🚀</div>
            <div className="stat-value">{stats?.overall?.total_starts || 0}</div>
            <div className="stat-label">Total Starts</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats?.overall?.total_completions || 0}</div>
            <div className="stat-label">Completions</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏭️</div>
            <div className="stat-value">{stats?.overall?.total_skips || 0}</div>
            <div className="stat-label">Skips</div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-icon">📈</div>
            <div className="stat-value">{stats?.overall?.completion_rate || 0}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
        </div>

        {/* Per-Tour Statistics */}
        <section className="section-card">
          <h2>Performance by Tour</h2>
          <div className="table-container">
            <table className="analytics-table">
              <thead>
                <tr>
                  <th>Tour Name</th>
                  <th>Starts</th>
                  <th>Completions</th>
                  <th>Skips</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats?.perTour?.map((tour, index) => (
                  <tr key={index}>
                    <td className="tour-name">{tour.tour_name}</td>
                    <td>{tour.starts}</td>
                    <td>{tour.completions}</td>
                    <td>{tour.skips}</td>
                    <td>
                      <div className="completion-bar-container">
                        <div 
                          className="completion-bar" 
                          style={{ width: `${tour.completion_rate || 0}%` }}
                        ></div>
                        <span className="completion-text">{tour.completion_rate || 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Step-by-Step Analysis (if specific tour selected) */}
        {selectedTour !== 'all' && stats?.stepAnalysis?.length > 0 && (
          <section className="section-card">
            <h2>Step-by-Step Drop-off Analysis</h2>
            <div className="step-analysis">
              {stats.stepAnalysis.map((step, index) => {
                const stepIndex = parseInt(step.step_index);
                const prevStep = index > 0 ? stats.stepAnalysis[index - 1] : null;
                const dropOff = prevStep 
                  ? ((prevStep.unique_users - step.unique_users) / prevStep.unique_users * 100).toFixed(1)
                  : 0;

                return (
                  <div key={index} className="step-item">
                    <div className="step-header">
                      <span className="step-number">Step {stepIndex + 1}</span>
                      {dropOff > 0 && (
                        <span className="drop-off">-{dropOff}% from previous</span>
                      )}
                    </div>
                    <div className="step-stats">
                      <span>{step.unique_users} users viewed</span>
                      <span>{step.views} total views</span>
                    </div>
                    <div className="step-bar-container">
                      <div 
                        className="step-bar" 
                        style={{ 
                          width: `${(step.unique_users / stats.stepAnalysis[0].unique_users * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Daily Trend */}
        <section className="section-card">
          <h2>Daily Trend (Last 30 Days)</h2>
          <div className="chart-container">
            {stats?.dailyTrend?.length > 0 ? (
              <div className="simple-chart">
                {stats.dailyTrend.reverse().map((day, index) => {
                  const maxStarts = Math.max(...stats.dailyTrend.map(d => d.starts));
                  const height = maxStarts > 0 ? (day.starts / maxStarts * 100) : 0;
                  
                  return (
                    <div key={index} className="chart-bar-group">
                      <div className="chart-bars">
                        <div 
                          className="chart-bar starts" 
                          style={{ height: `${height}%` }}
                          title={`${day.starts} starts`}
                        ></div>
                        <div 
                          className="chart-bar completions" 
                          style={{ height: `${maxStarts > 0 ? (day.completions / maxStarts * 100) : 0}%` }}
                          title={`${day.completions} completions`}
                        ></div>
                      </div>
                      <div className="chart-label">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-data">No data available for the selected period</p>
            )}
          </div>
          <div className="chart-legend">
            <span className="legend-item">
              <span className="legend-color starts"></span> Starts
            </span>
            <span className="legend-item">
              <span className="legend-color completions"></span> Completions
            </span>
          </div>
        </section>

        {/* User Engagement */}
        <section className="section-card">
          <h2>User Engagement</h2>
          <div className="engagement-grid">
            {stats?.userEngagement?.map((segment, index) => (
              <div key={index} className="engagement-card">
                <h3>{segment.user_type === 'anonymous' ? '👤 Anonymous Users' : '🔐 Logged-in Users'}</h3>
                <div className="engagement-stats">
                  <div className="engagement-stat">
                    <span className="stat-label">Starts</span>
                    <span className="stat-value">{segment.starts}</span>
                  </div>
                  <div className="engagement-stat">
                    <span className="stat-label">Completions</span>
                    <span className="stat-value">{segment.completions}</span>
                  </div>
                  <div className="engagement-stat highlight">
                    <span className="stat-label">Completion Rate</span>
                    <span className="stat-value">{segment.completion_rate || 0}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights */}
        <section className="section-card insights">
          <h2>💡 Insights & Recommendations</h2>
          <div className="insights-list">
            {stats?.overall?.completion_rate < 50 && (
              <div className="insight warning">
                <strong>⚠️ Low Completion Rate:</strong> Consider simplifying tours or reducing the number of steps.
              </div>
            )}
            {stats?.overall?.completion_rate >= 70 && (
              <div className="insight success">
                <strong>✅ Great Engagement:</strong> Your tours are performing well! Users find them helpful.
              </div>
            )}
            {stats?.overall?.total_skips > stats?.overall?.total_completions && (
              <div className="insight warning">
                <strong>⏭️ High Skip Rate:</strong> Users are skipping tours more than completing them. Review tour content and timing.
              </div>
            )}
            {stats?.userEngagement?.find(u => u.user_type === 'logged_in')?.completion_rate > 
             stats?.userEngagement?.find(u => u.user_type === 'anonymous')?.completion_rate && (
              <div className="insight info">
                <strong>🔐 Logged-in Users Engage More:</strong> Consider prompting users to sign up before showing tours.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

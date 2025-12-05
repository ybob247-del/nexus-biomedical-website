import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminChatbotAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7');
  const [language, setLanguage] = useState('all');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, language]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chatbot/analytics?timeRange=${timeRange}&language=${language}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data);
      } else {
        setError(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>No analytics data available</div>
      </div>
    );
  }

  const { stats, popularQuestions, languageStats, dailyTrends, matchedFAQs, recentFeedback } = analytics;

  // Chart data for daily trends
  const dailyTrendsData = {
    labels: dailyTrends.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Interactions',
        data: dailyTrends.map(d => d.interactions),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Sessions',
        data: dailyTrends.map(d => d.sessions),
        borderColor: 'rgb(236, 72, 153)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart data for language distribution
  const languageData = {
    labels: languageStats.map(l => l.language.toUpperCase()),
    datasets: [{
      data: languageStats.map(l => l.count),
      backgroundColor: [
        'rgba(147, 51, 234, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)'
      ],
      borderColor: [
        'rgb(147, 51, 234)',
        'rgb(236, 72, 153)',
        'rgb(59, 130, 246)',
        'rgb(16, 185, 129)'
      ],
      borderWidth: 2
    }]
  };

  // Chart data for popular questions
  const popularQuestionsData = {
    labels: popularQuestions.slice(0, 10).map(q => q.question.substring(0, 40) + '...'),
    datasets: [{
      label: 'Question Count',
      data: popularQuestions.slice(0, 10).map(q => q.count),
      backgroundColor: 'rgba(147, 51, 234, 0.8)',
      borderColor: 'rgb(147, 51, 234)',
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: '#ffffff' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🤖 Chatbot Analytics Dashboard</h1>
        <div style={styles.filters}>
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={styles.select}>
            <option value="7">Last 7 Days</option>
            <option value="14">Last 14 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={styles.select}>
            <option value="all">All Languages</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
          <button onClick={fetchAnalytics} style={styles.refreshButton}>
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>💬</div>
          <div style={styles.statValue}>{stats.total_interactions}</div>
          <div style={styles.statLabel}>Total Interactions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statValue}>{stats.unique_sessions}</div>
          <div style={styles.statLabel}>Unique Sessions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>⚡</div>
          <div style={styles.statValue}>{Math.round(stats.avg_response_time)}ms</div>
          <div style={styles.statLabel}>Avg Response Time</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>😊</div>
          <div style={styles.statValue}>{stats.satisfaction_rate}%</div>
          <div style={styles.statLabel}>Satisfaction Rate</div>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Daily Interaction Trends</h3>
          <div style={styles.chartContainer}>
            <Line data={dailyTrendsData} options={chartOptions} />
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Language Distribution</h3>
          <div style={styles.chartContainer}>
            <Doughnut data={languageData} options={{ ...chartOptions, scales: undefined }} />
          </div>
        </div>
      </div>

      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Top 10 Popular Questions</h3>
        <div style={styles.chartContainer}>
          <Bar data={popularQuestionsData} options={{ ...chartOptions, indexAxis: 'y' }} />
        </div>
      </div>

      {/* Popular Questions Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>📊 Popular Questions</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Question</th>
                <th style={styles.th}>Language</th>
                <th style={styles.th}>Count</th>
                <th style={styles.th}>Avg Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {popularQuestions.map((q, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{q.question}</td>
                  <td style={styles.td}>{q.language.toUpperCase()}</td>
                  <td style={styles.td}>{q.count}</td>
                  <td style={styles.td}>
                    {q.avg_satisfaction !== null 
                      ? `${(q.avg_satisfaction * 100).toFixed(0)}%` 
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matched FAQs */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>🎯 Most Matched FAQs</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>FAQ Question</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Match Count</th>
              </tr>
            </thead>
            <tbody>
              {matchedFAQs.map((faq, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{faq.faq_question}</td>
                  <td style={styles.td}>{faq.category}</td>
                  <td style={styles.td}>{faq.match_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Feedback */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>💭 Recent User Feedback</h3>
        <div style={styles.feedbackList}>
          {recentFeedback.map((feedback, index) => (
            <div key={index} style={styles.feedbackItem}>
              <div style={styles.feedbackHeader}>
                <span style={styles.feedbackSatisfaction}>
                  {feedback.user_satisfied ? '😊 Satisfied' : '😞 Unsatisfied'}
                </span>
                <span style={styles.feedbackDate}>
                  {new Date(feedback.created_at).toLocaleString()}
                </span>
              </div>
              <div style={styles.feedbackQuestion}>
                <strong>Q:</strong> {feedback.question}
              </div>
              {feedback.user_feedback && (
                <div style={styles.feedbackText}>
                  <strong>Feedback:</strong> {feedback.user_feedback}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0118 0%, #1a0b2e 50%, #2d1b4e 100%)',
    padding: '2rem',
    color: '#ffffff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    margin: 0
  },
  filters: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap'
  },
  select: {
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid rgba(147, 51, 234, 0.5)',
    background: 'rgba(147, 51, 234, 0.1)',
    color: '#ffffff',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  refreshButton: {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
    color: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'rgba(147, 51, 234, 0.1)',
    border: '1px solid rgba(147, 51, 234, 0.3)',
    borderRadius: '1rem',
    padding: '1.5rem',
    textAlign: 'center'
  },
  statIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#ec4899',
    marginBottom: '0.5rem'
  },
  statLabel: {
    fontSize: '0.95rem',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  chartCard: {
    background: 'rgba(147, 51, 234, 0.1)',
    border: '1px solid rgba(147, 51, 234, 0.3)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  chartTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem'
  },
  chartContainer: {
    height: '300px'
  },
  tableCard: {
    background: 'rgba(147, 51, 234, 0.1)',
    border: '1px solid rgba(147, 51, 234, 0.3)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginBottom: '2rem'
  },
  tableTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '1rem'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    textAlign: 'left',
    padding: '1rem',
    borderBottom: '2px solid rgba(147, 51, 234, 0.5)',
    fontWeight: '600',
    color: '#ec4899'
  },
  tr: {
    borderBottom: '1px solid rgba(147, 51, 234, 0.2)'
  },
  td: {
    padding: '1rem',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  feedbackItem: {
    background: 'rgba(147, 51, 234, 0.05)',
    border: '1px solid rgba(147, 51, 234, 0.2)',
    borderRadius: '0.75rem',
    padding: '1rem'
  },
  feedbackHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    fontSize: '0.9rem'
  },
  feedbackSatisfaction: {
    fontWeight: '600'
  },
  feedbackDate: {
    color: 'rgba(255, 255, 255, 0.6)'
  },
  feedbackQuestion: {
    marginBottom: '0.5rem',
    color: 'rgba(255, 255, 255, 0.9)'
  },
  feedbackText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic'
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    padding: '3rem',
    color: '#ec4899'
  },
  error: {
    textAlign: 'center',
    fontSize: '1.25rem',
    padding: '3rem',
    color: '#ef4444',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '1rem',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  }
};

export default AdminChatbotAnalytics;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/admin-ab-tests.css';

export default function AdminABTests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTest, setNewTest] = useState({
    test_name: '',
    tour_name: '',
    variant_a_config: '',
    variant_b_config: '',
    traffic_split: 50
  });

  useEffect(() => {
    // Check if user is admin (owner)
    if (!user || user.open_id !== import.meta.env.VITE_OWNER_OPEN_ID) {
      navigate('/');
      return;
    }

    fetchTests();
  }, [user, navigate]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ab-tests', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch A/B tests');
      }

      const data = await response.json();
      setTests(data.tests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/ab-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newTest,
          variant_a_config: JSON.parse(newTest.variant_a_config),
          variant_b_config: JSON.parse(newTest.variant_b_config)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create A/B test');
      }

      // Reset form and close modal
      setNewTest({
        test_name: '',
        tour_name: '',
        variant_a_config: '',
        variant_b_config: '',
        traffic_split: 50
      });
      setShowCreateModal(false);
      
      // Refresh tests list
      fetchTests();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStopTest = async (testId) => {
    if (!confirm('Are you sure you want to stop this A/B test?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ab-tests/${testId}/stop`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to stop A/B test');
      }

      // Refresh tests list
      fetchTests();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const calculateStats = (test) => {
    const variantA = test.variants?.find(v => v.variant_name === 'A');
    const variantB = test.variants?.find(v => v.variant_name === 'B');

    const aViews = variantA?.views || 0;
    const bViews = variantB?.views || 0;
    const aCompletions = variantA?.completions || 0;
    const bCompletions = variantB?.completions || 0;

    const aRate = aViews > 0 ? ((aCompletions / aViews) * 100).toFixed(1) : 0;
    const bRate = bViews > 0 ? ((bCompletions / bViews) * 100).toFixed(1) : 0;

    // Simple statistical significance check (chi-square approximation)
    const totalViews = aViews + bViews;
    const pooledRate = totalViews > 0 ? (aCompletions + bCompletions) / totalViews : 0;
    
    const expectedA = aViews * pooledRate;
    const expectedB = bViews * pooledRate;
    
    const chiSquare = expectedA > 0 && expectedB > 0
      ? Math.pow(aCompletions - expectedA, 2) / expectedA + 
        Math.pow(bCompletions - expectedB, 2) / expectedB
      : 0;

    // Chi-square critical value for p=0.05 with 1 degree of freedom is 3.841
    const isSignificant = chiSquare > 3.841 && totalViews >= 100;

    return {
      aViews,
      bViews,
      aCompletions,
      bCompletions,
      aRate,
      bRate,
      isSignificant,
      winner: parseFloat(aRate) > parseFloat(bRate) ? 'A' : 'B',
      improvement: Math.abs(parseFloat(aRate) - parseFloat(bRate)).toFixed(1)
    };
  };

  if (loading) {
    return (
      <div className="admin-ab-loading">
        <div className="loading-spinner"></div>
        <p>Loading A/B tests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-ab-error">
        <h2>Error Loading A/B Tests</h2>
        <p>{error}</p>
        <button onClick={fetchTests}>Retry</button>
      </div>
    );
  }

  return (
    <div className="admin-ab-tests">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="cosmic-blob blob-1"></div>
        <div className="cosmic-blob blob-2"></div>
        <div className="cosmic-blob blob-3"></div>
      </div>

      {/* Header */}
      <div className="admin-ab-header">
        <div className="header-content">
          <h1>🧪 A/B Test Management</h1>
          <p>Optimize tour effectiveness with data-driven experimentation</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowCreateModal(true)} className="create-btn">
            + Create New Test
          </button>
          <button onClick={() => navigate('/admin/analytics')} className="back-btn">
            ← Back to Admin
          </button>
        </div>
      </div>

      {/* Active Tests */}
      <div className="tests-section">
        <h2>🚀 Active Tests</h2>
        {tests.filter(t => t.is_active).length > 0 ? (
          <div className="tests-grid">
            {tests.filter(t => t.is_active).map((test) => {
              const stats = calculateStats(test);
              return (
                <div key={test.id} className="test-card active">
                  <div className="test-header">
                    <h3>{test.test_name}</h3>
                    <span className="test-badge active">Active</span>
                  </div>
                  
                  <div className="test-info">
                    <p><strong>Tour:</strong> {test.tour_name}</p>
                    <p><strong>Started:</strong> {new Date(test.start_date).toLocaleDateString()}</p>
                    <p><strong>Traffic Split:</strong> {test.traffic_split}% / {100 - test.traffic_split}%</p>
                  </div>

                  <div className="test-results">
                    <div className="variant-result">
                      <h4>Variant A</h4>
                      <p className="completion-rate">{stats.aRate}%</p>
                      <p className="views">{stats.aViews} views · {stats.aCompletions} completions</p>
                    </div>
                    
                    <div className="vs-divider">VS</div>
                    
                    <div className="variant-result">
                      <h4>Variant B</h4>
                      <p className="completion-rate">{stats.bRate}%</p>
                      <p className="views">{stats.bViews} views · {stats.bCompletions} completions</p>
                    </div>
                  </div>

                  {stats.isSignificant && (
                    <div className="significance-badge">
                      ✅ Statistically Significant
                      <p>Variant {stats.winner} wins by {stats.improvement}%</p>
                    </div>
                  )}

                  <div className="test-actions">
                    <button 
                      onClick={() => handleStopTest(test.id)}
                      className="stop-btn"
                    >
                      Stop Test
                    </button>
                    <button 
                      onClick={() => navigate(`/admin/ab-tests/${test.id}`)}
                      className="details-btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-tests">
            <p>No active A/B tests. Create one to start optimizing your tours!</p>
          </div>
        )}
      </div>

      {/* Completed Tests */}
      {tests.filter(t => !t.is_active).length > 0 && (
        <div className="tests-section">
          <h2>📊 Completed Tests</h2>
          <div className="tests-grid">
            {tests.filter(t => !t.is_active).map((test) => {
              const stats = calculateStats(test);
              return (
                <div key={test.id} className="test-card completed">
                  <div className="test-header">
                    <h3>{test.test_name}</h3>
                    <span className="test-badge completed">Completed</span>
                  </div>
                  
                  <div className="test-info">
                    <p><strong>Tour:</strong> {test.tour_name}</p>
                    <p><strong>Duration:</strong> {new Date(test.start_date).toLocaleDateString()} - {test.end_date ? new Date(test.end_date).toLocaleDateString() : 'Ongoing'}</p>
                  </div>

                  <div className="test-results">
                    <div className="variant-result">
                      <h4>Variant A</h4>
                      <p className="completion-rate">{stats.aRate}%</p>
                      <p className="views">{stats.aViews} views</p>
                    </div>
                    
                    <div className="vs-divider">VS</div>
                    
                    <div className="variant-result">
                      <h4>Variant B</h4>
                      <p className="completion-rate">{stats.bRate}%</p>
                      <p className="views">{stats.bViews} views</p>
                    </div>
                  </div>

                  {stats.isSignificant && (
                    <div className="winner-badge">
                      🏆 Winner: Variant {stats.winner}
                      <p>+{stats.improvement}% improvement</p>
                    </div>
                  )}

                  <button 
                    onClick={() => navigate(`/admin/ab-tests/${test.id}`)}
                    className="details-btn"
                  >
                    View Results
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New A/B Test</h2>
            <form onSubmit={handleCreateTest}>
              <div className="form-group">
                <label>Test Name</label>
                <input
                  type="text"
                  value={newTest.test_name}
                  onChange={(e) => setNewTest({...newTest, test_name: e.target.value})}
                  placeholder="e.g., EndoGuard Tour Optimization"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tour Name</label>
                <select
                  value={newTest.tour_name}
                  onChange={(e) => setNewTest({...newTest, tour_name: e.target.value})}
                  required
                >
                  <option value="">Select a tour...</option>
                  <option value="endoguard-assessment">EndoGuard Assessment</option>
                  <option value="rxguard-dashboard">RxGuard Dashboard</option>
                  <option value="main-dashboard">Main Dashboard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Traffic Split (% for Variant A)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newTest.traffic_split}
                  onChange={(e) => setNewTest({...newTest, traffic_split: parseInt(e.target.value)})}
                />
                <p className="split-display">{newTest.traffic_split}% / {100 - newTest.traffic_split}%</p>
              </div>

              <div className="form-group">
                <label>Variant A Configuration (JSON)</label>
                <textarea
                  value={newTest.variant_a_config}
                  onChange={(e) => setNewTest({...newTest, variant_a_config: e.target.value})}
                  placeholder='{"showProgress": true, "animate": true}'
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Variant B Configuration (JSON)</label>
                <textarea
                  value={newTest.variant_b_config}
                  onChange={(e) => setNewTest({...newTest, variant_b_config: e.target.value})}
                  placeholder='{"showProgress": false, "animate": false}'
                  rows={4}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="documentation-section">
        <h2>📚 A/B Testing Guide</h2>
        <div className="doc-grid">
          <div className="doc-card">
            <h3>How It Works</h3>
            <ol>
              <li>Create a test with two variant configurations</li>
              <li>Users are randomly assigned to variant A or B</li>
              <li>Track completion rates for each variant</li>
              <li>Stop the test when statistically significant</li>
              <li>Implement the winning variant</li>
            </ol>
          </div>

          <div className="doc-card">
            <h3>Best Practices</h3>
            <ul>
              <li>Test one variable at a time</li>
              <li>Run tests for at least 100 views per variant</li>
              <li>Wait for statistical significance</li>
              <li>Document your hypotheses</li>
              <li>Implement winners quickly</li>
            </ul>
          </div>

          <div className="doc-card">
            <h3>Configuration Examples</h3>
            <pre>{`// Variant A: Show progress bar
{
  "showProgress": true,
  "animate": true,
  "allowClose": true
}

// Variant B: Hide progress bar
{
  "showProgress": false,
  "animate": true,
  "allowClose": true
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

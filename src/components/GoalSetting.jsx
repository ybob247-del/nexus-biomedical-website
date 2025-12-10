import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Target, TrendingUp, Calendar, Bell, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';

export default function GoalSetting() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    goalType: 'bmi_reduction',
    title: '',
    description: '',
    targetValue: '',
    currentValue: '',
    unit: 'kg',
    targetDate: '',
    reminderFrequency: 'weekly',
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/goals?userId=${user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setGoals(data.goals);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCreateModal(false);
        setFormData({
          goalType: 'bmi_reduction',
          title: '',
          description: '',
          targetValue: '',
          currentValue: '',
          unit: 'kg',
          targetDate: '',
          reminderFrequency: 'weekly',
        });
        fetchGoals();
      } else {
        alert('Failed to create goal: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal');
    }
  };

  const handleUpdateProgress = async (goalId, newValue) => {
    try {
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId,
          currentValue: newValue,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`/api/goals?goalId=${goalId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const calculateProgress = (goal) => {
    if (!goal.target_value || !goal.current_value) return 0;
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100));
  };

  const getGoalTypeLabel = (type) => {
    const labels = {
      bmi_reduction: 'BMI Reduction',
      symptom_improvement: 'Symptom Improvement',
      edc_reduction: 'EDC Exposure Reduction',
      custom: 'Custom Goal',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="goal-setting-container">
        <div className="loading">Loading your goals...</div>
      </div>
    );
  }

  return (
    <div className="goal-setting-container">
      <div className="goal-header">
        <div>
          <h1>
            <Target size={32} />
            My Health Goals
          </h1>
          <p>Set goals, track progress, and achieve better health outcomes</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          Create New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="empty-state">
          <Target size={64} color="#D946EF" />
          <h3>No goals yet</h3>
          <p>Create your first health goal to start tracking your progress</p>
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="goals-grid">
          {goals.map((goal) => (
            <div key={goal.id} className={`goal-card ${goal.status}`}>
              <div className="goal-card-header">
                <div>
                  <span className="goal-type-badge">{getGoalTypeLabel(goal.goal_type)}</span>
                  <h3>{goal.title}</h3>
                  {goal.description && <p className="goal-description">{goal.description}</p>}
                </div>
                <div className="goal-actions">
                  <button
                    className="icon-btn"
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Delete goal"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {goal.target_value && (
                <div className="goal-progress">
                  <div className="progress-info">
                    <span>
                      {goal.current_value || 0} / {goal.target_value} {goal.unit}
                    </span>
                    <span>{calculateProgress(goal)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${calculateProgress(goal)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="goal-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                </div>
                <div className="meta-item">
                  <Bell size={16} />
                  <span>Reminders: {goal.reminder_frequency}</span>
                </div>
                {goal.status === 'completed' && (
                  <div className="meta-item completed">
                    <CheckCircle size={16} />
                    <span>Completed!</span>
                  </div>
                )}
              </div>

              {goal.status === 'active' && (
                <div className="goal-update">
                  <input
                    type="number"
                    placeholder="Update progress..."
                    step="0.1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value) {
                        handleUpdateProgress(goal.id, parseFloat(e.target.value));
                        e.target.value = '';
                      }
                    }}
                  />
                  <span className="hint">Press Enter to update</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Health Goal</h2>
            <form onSubmit={handleCreateGoal}>
              <div className="form-group">
                <label>Goal Type</label>
                <select
                  value={formData.goalType}
                  onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                  required
                >
                  <option value="bmi_reduction">BMI Reduction</option>
                  <option value="symptom_improvement">Symptom Improvement</option>
                  <option value="edc_reduction">EDC Exposure Reduction</option>
                  <option value="custom">Custom Goal</option>
                </select>
              </div>

              <div className="form-group">
                <label>Goal Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Reduce BMI by 5 points"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about your goal..."
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Current Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Target Value</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, points, %"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Target Date *</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Reminder Frequency</label>
                  <select
                    value={formData.reminderFrequency}
                    onChange={(e) =>
                      setFormData({ ...formData, reminderFrequency: e.target.value })
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .goal-setting-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .goal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
        }

        .goal-header h1 {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 8px 0;
          color: #1f2937;
        }

        .goal-header p {
          color: #6b7280;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-state h3 {
          margin: 20px 0 8px 0;
          color: #1f2937;
        }

        .empty-state p {
          color: #6b7280;
          margin-bottom: 24px;
        }

        .goals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 24px;
        }

        .goal-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        .goal-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .goal-card.completed {
          border-color: #10b981;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }

        .goal-card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .goal-type-badge {
          display: inline-block;
          background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .goal-card h3 {
          margin: 8px 0;
          color: #1f2937;
          font-size: 18px;
        }

        .goal-description {
          color: #6b7280;
          font-size: 14px;
          margin: 4px 0 0 0;
        }

        .goal-actions {
          display: flex;
          gap: 8px;
        }

        .icon-btn {
          background: none;
          border: none;
          padding: 8px;
          cursor: pointer;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .icon-btn:hover {
          background: #f3f4f6;
        }

        .goal-progress {
          margin-bottom: 20px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D946EF 0%, #C026D3 100%);
          transition: width 0.3s ease;
        }

        .goal-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .meta-item.completed {
          color: #10b981;
          font-weight: 600;
        }

        .goal-update {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .goal-update input {
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .goal-update input:focus {
          outline: none;
          border-color: #D946EF;
        }

        .goal-update .hint {
          font-size: 12px;
          color: #9ca3af;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-content h2 {
          margin: 0 0 24px 0;
          color: #1f2937;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #D946EF;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(217, 70, 239, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .goal-header {
            flex-direction: column;
            gap: 20px;
          }

          .goals-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

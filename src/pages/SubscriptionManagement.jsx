import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/subscription-management.css';

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changingPlan, setChangingPlan] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/account/subscription');
      return;
    }

    loadSubscriptions();
  }, [user, token, navigate]);

  const loadSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions/my-subscriptions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePlan = async (platform, newPlan) => {
    setChangingPlan(platform);

    try {
      const response = await fetch('/api/subscriptions/change-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ platform, newPlan })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Plan changed to ${newPlan} successfully!`);
        loadSubscriptions();
      } else {
        throw new Error(data.error || 'Failed to change plan');
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      alert('Failed to change plan. Please try again or contact support.');
    } finally {
      setChangingPlan(null);
    }
  };

  const handleCancelSubscription = async (platform) => {
    if (!confirm(`Are you sure you want to cancel your ${platform} subscription? You'll lose access at the end of your billing period.`)) {
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ platform })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Subscription canceled successfully. You\'ll have access until the end of your billing period.');
        loadSubscriptions();
      } else {
        throw new Error(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription. Please contact support.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlatformInfo = (platform) => {
    const info = {
      rxguard: {
        name: 'RxGuard™',
        color: '#00A8CC',
        icon: '💊',
        description: 'Drug Interaction Checker'
      },
      endoguard: {
        name: 'EndoGuard™',
        color: '#D946EF',
        icon: '🧬',
        description: 'Hormone Health Platform'
      }
    };
    return info[platform.toLowerCase()] || { name: platform, color: '#666', icon: '📱', description: '' };
  };

  const getPricing = (platform, plan) => {
    const pricing = {
      rxguard: {
        monthly: { price: '$39', period: 'month', annual: null },
        yearly: { price: '$374', period: 'year', annual: '$31.17/month' }
      },
      endoguard: {
        monthly: { price: '$97', period: 'month', annual: null },
        yearly: { price: '$932', period: 'year', annual: '$77.67/month' }
      }
    };
    return pricing[platform.toLowerCase()]?.[plan] || { price: 'N/A', period: 'month' };
  };

  if (loading) {
    return (
      <div className="subscription-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-management">
      <div className="page-header">
        <h1>Subscription Management</h1>
        <p>Manage your active subscriptions and billing</p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Active Subscriptions</h2>
          <p>You don't have any active subscriptions yet.</p>
          <button onClick={() => navigate('/dashboard')} className="cta-button">
            Explore Platforms
          </button>
        </div>
      ) : (
        <div className="subscriptions-grid">
          {subscriptions.map((sub) => {
            const platformInfo = getPlatformInfo(sub.platform);
            const pricing = getPricing(sub.platform, sub.selected_plan || 'monthly');
            const isTrialing = sub.status === 'trialing';
            const isCanceled = sub.cancel_at_period_end;

            return (
              <div key={sub.id} className="subscription-card" style={{ borderColor: platformInfo.color }}>
                <div className="card-header" style={{ background: `linear-gradient(135deg, ${platformInfo.color} 0%, ${platformInfo.color}dd 100%)` }}>
                  <div className="platform-info">
                    <span className="platform-icon">{platformInfo.icon}</span>
                    <div>
                      <h2>{platformInfo.name}</h2>
                      <p>{platformInfo.description}</p>
                    </div>
                  </div>
                  <div className="status-badge" style={{ 
                    background: isTrialing ? '#ffc107' : isCanceled ? '#ff6b6b' : '#28a745'
                  }}>
                    {isTrialing ? 'Trial' : isCanceled ? 'Canceled' : 'Active'}
                  </div>
                </div>

                <div className="card-body">
                  {/* Current Plan */}
                  <div className="info-section">
                    <h3>Current Plan</h3>
                    <div className="plan-details">
                      <div className="plan-price">
                        <span className="price">{pricing.price}</span>
                        <span className="period">/{pricing.period}</span>
                      </div>
                      {pricing.annual && (
                        <div className="annual-price">{pricing.annual}</div>
                      )}
                      <div className="plan-type">
                        {sub.selected_plan === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}
                      </div>
                    </div>
                  </div>

                  {/* Trial Info */}
                  {isTrialing && (
                    <div className="info-section trial-info">
                      <h3>Trial Period</h3>
                      <p><strong>Started:</strong> {formatDate(sub.trial_start)}</p>
                      <p><strong>Ends:</strong> {formatDate(sub.trial_end)}</p>
                      <p className="trial-note">
                        Your trial will automatically convert to a paid subscription on {formatDate(sub.trial_end)}.
                      </p>
                    </div>
                  )}

                  {/* Billing Info */}
                  {!isTrialing && (
                    <div className="info-section">
                      <h3>Billing Information</h3>
                      <p><strong>Current Period:</strong> {formatDate(sub.current_period_start)} - {formatDate(sub.current_period_end)}</p>
                      {isCanceled ? (
                        <p className="cancel-note">
                          Your subscription will end on {formatDate(sub.current_period_end)}. You'll have access until then.
                        </p>
                      ) : (
                        <p><strong>Next Billing Date:</strong> {formatDate(sub.current_period_end)}</p>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  {!isCanceled && (
                    <div className="card-actions">
                      {/* Change Plan */}
                      {!isTrialing && (
                        <div className="plan-switch">
                          <h4>Switch Plan</h4>
                          <div className="plan-options">
                            <button
                              onClick={() => handleChangePlan(sub.platform, 'monthly')}
                              disabled={sub.selected_plan === 'monthly' || changingPlan === sub.platform}
                              className={`plan-option ${sub.selected_plan === 'monthly' ? 'active' : ''}`}
                            >
                              <div className="option-label">Monthly</div>
                              <div className="option-price">{getPricing(sub.platform, 'monthly').price}/mo</div>
                            </button>
                            <button
                              onClick={() => handleChangePlan(sub.platform, 'yearly')}
                              disabled={sub.selected_plan === 'yearly' || changingPlan === sub.platform}
                              className={`plan-option ${sub.selected_plan === 'yearly' ? 'active' : ''}`}
                            >
                              <div className="option-label">Yearly</div>
                              <div className="option-price">{getPricing(sub.platform, 'yearly').price}/yr</div>
                              <div className="option-savings">Save 20%</div>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Cancel Subscription */}
                      <button
                        onClick={() => handleCancelSubscription(sub.platform)}
                        className="cancel-button"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h3>Need Help?</h3>
        <p>Have questions about your subscription? <a href="mailto:support@nexusbiomedical.ai">Contact our support team</a></p>
      </div>
    </div>
  );
}

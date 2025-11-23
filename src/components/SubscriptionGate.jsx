/**
 * Subscription Gate Component
 * Checks if user has active subscription before allowing platform access
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function SubscriptionGate({ platform, children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user, platform]);

  const checkSubscription = async () => {
    try {
      const response = await fetch(
        `/api/stripe/subscription-status?userEmail=${encodeURIComponent(user.email)}&platform=${platform}`
      );
      const data = await response.json();

      if (data.success) {
        setSubscriptionStatus(data);
      }
    } catch (error) {
      console.error('Subscription check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setIsCreatingCheckout(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          userId: user.id,
          userEmail: user.email
        })
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        alert('Failed to create checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  if (isLoading) {
    return (
      <div className="subscription-gate loading">
        <div className="spinner"></div>
        <p>Checking subscription status...</p>
      </div>
    );
  }

  // User has access
  if (subscriptionStatus && subscriptionStatus.hasAccess) {
    return <>{children}</>;
  }

  // User needs to subscribe
  const platformInfo = {
    rxguard: {
      name: 'RxGuard™',
      price: '$39',
      trialDays: 14,
      description: 'AI-powered drug interaction checker with live FDA data',
      features: [
        'Search 100,000+ medications',
        'Real-time interaction checking',
        'Save medication lists',
        'FDA adverse event data',
        'Personalized risk analysis',
        'PDF reports'
      ]
    },
    endoguard: {
      name: 'EndoGuard™',
      price: '$29',
      trialDays: 14,
      description: 'Comprehensive hormone health and EDC exposure platform',
      features: [
        'Hormone health assessment',
        'EDC exposure calculator',
        'Symptom tracking',
        'Personalized recommendations',
        'Progress monitoring',
        'Educational resources'
      ]
    }
  };

  const info = platformInfo[platform.toLowerCase()];

  return (
    <div className="subscription-gate">
      <div className="subscription-prompt">
        <h1>🔒 Subscribe to Access {info.name}</h1>
        <p className="description">{info.description}</p>

        <div className="pricing-card">
          <div className="price">
            <span className="amount">{info.price}</span>
            <span className="period">/month</span>
          </div>
          <p className="trial-notice">✨ Start with a {info.trialDays}-day free trial</p>

          <ul className="features">
            {info.features.map((feature, index) => (
              <li key={index}>✓ {feature}</li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={isCreatingCheckout}
            className="subscribe-btn"
          >
            {isCreatingCheckout ? 'Loading...' : `Start ${info.trialDays}-Day Free Trial`}
          </button>

          <p className="cancel-notice">
            Cancel anytime. No commitment required.
          </p>
        </div>

        <button
          onClick={() => navigate('/pricing')}
          className="back-btn"
        >
          ← View All Plans
        </button>
      </div>

      <style jsx>{`
        .subscription-gate {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .subscription-gate.loading {
          flex-direction: column;
          color: white;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .subscription-prompt {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          max-width: 600px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .subscription-prompt h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .description {
          font-size: 1.1rem;
          color: #666;
          margin-bottom: 2rem;
        }

        .pricing-card {
          background: #f8f9fa;
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .price {
          text-align: center;
          margin-bottom: 1rem;
        }

        .amount {
          font-size: 3rem;
          font-weight: bold;
          color: #667eea;
        }

        .period {
          font-size: 1.2rem;
          color: #666;
        }

        .trial-notice {
          text-align: center;
          font-size: 1.1rem;
          color: #28a745;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .features {
          list-style: none;
          padding: 0;
          margin: 1.5rem 0;
        }

        .features li {
          padding: 0.5rem 0;
          font-size: 1rem;
          color: #333;
        }

        .subscribe-btn {
          width: 100%;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .subscribe-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .subscribe-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cancel-notice {
          text-align: center;
          font-size: 0.9rem;
          color: #999;
          margin-top: 1rem;
        }

        .back-btn {
          background: none;
          border: none;
          color: #667eea;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .back-btn:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/subscription-modal.css';

/**
 * Reusable Subscription Modal Component
 * Shows when users click on paid features (PDF download, detailed recommendations, etc.)
 * Used across ALL platforms: EndoGuard, RxGuard, ElderWatch, PediCalc, ClinicalIQ, ReguReady, SkinScan
 */
export default function SubscriptionModal({ isOpen, onClose, feature = 'this premium feature', platform = 'Nexus' }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    if (!user) {
      // Redirect to signup if not logged in
      navigate('/signup', { state: { returnTo: window.location.pathname } });
      return;
    }

    setIsLoading(true);
    
    try {
      // Redirect to pricing page or Stripe checkout
      navigate('/pricing');
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to process upgrade. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const premiumFeatures = [
    {
      icon: '📊',
      title: 'Unlimited Assessments & Tracking',
      description: 'Take unlimited assessments and track your progress over time'
    },
    {
      icon: '🧪',
      title: 'Detailed Test Recommendations',
      description: 'Get specific lab panels with markers and downloadable lab letters'
    },
    {
      icon: '📋',
      title: 'Personalized Action Plans',
      description: '30/60/90 day protocols tailored to your specific health needs'
    },
    {
      icon: '👨‍⚕️',
      title: 'Provider Referrals',
      description: 'Connect with specialists and healthcare providers in your area'
    },
    {
      icon: '💊',
      title: 'Supplement Recommendations',
      description: 'Specific brands, dosages, and protocols for your conditions'
    },
    {
      icon: '📄',
      title: 'PDF Reports & Charts',
      description: 'Download professional reports and progress visualizations'
    },
    {
      icon: '💬',
      title: 'Priority Email Support',
      description: 'Get help from our health coaching team within 24 hours'
    },
    {
      icon: '🔄',
      title: 'Progress Tracking',
      description: 'Monitor your health metrics and see improvements over time'
    }
  ];

  return (
    <div className="subscription-modal-overlay" onClick={onClose}>
      <div className="subscription-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <div className="lock-icon">🔒</div>
          <h2>Premium Feature</h2>
          <p className="modal-subtitle">
            {user 
              ? `Upgrade to access ${feature} and unlock all premium features` 
              : `Sign up for a free account to access ${feature}`}
          </p>
        </div>

        <div className="modal-pricing">
          <div className="price-tag">
            <span className="price-amount">$49</span>
            <span className="price-period">/month</span>
          </div>
          <p className="price-description">Cancel anytime • 14-day money-back guarantee</p>
        </div>

        <div className="modal-features">
          <h3>What's Included:</h3>
          <div className="features-grid">
            {premiumFeatures.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-content">
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn-upgrade" 
            onClick={handleUpgrade}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : user ? 'Upgrade Now' : 'Sign Up Free'}
          </button>
          <button className="btn-cancel" onClick={onClose}>
            Maybe Later
          </button>
        </div>

        <div className="modal-footer">
          <p>✨ Join 10,000+ users taking control of their health</p>
        </div>
      </div>
    </div>
  );
}

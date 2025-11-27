import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Trial Expiration Banner Component
 * Shows a banner when user's trial is about to expire or has expired
 * Provides "Upgrade Now" button to redirect to Stripe checkout
 */
export default function TrialExpirationBanner({ platform }) {
  const { user } = useAuth();
  const [trialStatus, setTrialStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user || !platform) {
      setLoading(false);
      return;
    }

    checkTrialStatus();
  }, [user, platform]);

  const checkTrialStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/trials/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ platform })
      });

      const data = await response.json();
      
      if (data.status === 'trialing') {
        const daysRemaining = Math.ceil((new Date(data.trialEnd) - new Date()) / (1000 * 60 * 60 * 24));
        setTrialStatus({
          isActive: true,
          daysRemaining,
          trialEnd: data.trialEnd,
          selectedPlan: data.selectedPlan || 'monthly'
        });
      } else if (data.status === 'expired') {
        setTrialStatus({
          isActive: false,
          expired: true,
          selectedPlan: data.selectedPlan || 'monthly'
        });
      }
    } catch (error) {
      console.error('Error checking trial status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setRedirecting(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform,
          userId: user.id,
          userEmail: user.email,
          selectedPlan: trialStatus.selectedPlan
        })
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
      setRedirecting(false);
    }
  };

  if (loading || !trialStatus) {
    return null;
  }

  // Don't show banner if trial has more than 3 days remaining
  if (trialStatus.isActive && trialStatus.daysRemaining > 3) {
    return null;
  }

  const platformColors = {
    rxguard: '#00A8CC',
    endoguard: '#D946EF'
  };

  const platformNames = {
    rxguard: 'RxGuard™',
    endoguard: 'EndoGuard™'
  };

  const pricing = {
    rxguard: {
      monthly: { price: '$39', period: 'month' },
      yearly: { price: '$374', period: 'year', savings: '20%' }
    },
    endoguard: {
      monthly: { price: '$97', period: 'month' },
      yearly: { price: '$932', period: 'year', savings: '20%' }
    }
  };

  const color = platformColors[platform.toLowerCase()] || '#00A8CC';
  const platformName = platformNames[platform.toLowerCase()] || platform;
  const planPricing = pricing[platform.toLowerCase()]?.[trialStatus.selectedPlan] || pricing.rxguard.monthly;

  // Expired trial banner (urgent)
  if (trialStatus.expired) {
    return (
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '800px',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
        padding: '20px 30px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        zIndex: 9999,
        animation: 'slideDown 0.5s ease-out'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{
              margin: '0 0 8px 0',
              color: 'white',
              fontSize: '20px',
              fontWeight: '700'
            }}>
              ⏰ Your {platformName} Trial Has Expired
            </h3>
            <p style={{
              margin: 0,
              color: 'rgba(255,255,255,0.95)',
              fontSize: '15px',
              lineHeight: '1.5'
            }}>
              Continue your access for just <strong>{planPricing.price}/{planPricing.period}</strong>
              {planPricing.savings && ` (Save ${planPricing.savings})`}
            </p>
          </div>
          
          <button
            onClick={handleUpgrade}
            disabled={redirecting}
            style={{
              background: 'white',
              color: '#ff6b6b',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: redirecting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              opacity: redirecting ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!redirecting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            {redirecting ? 'Redirecting...' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    );
  }

  // Expiring soon banner (warning)
  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '800px',
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      padding: '20px 30px',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      zIndex: 9999,
      animation: 'slideDown 0.5s ease-out'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h3 style={{
            margin: '0 0 8px 0',
            color: 'white',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {trialStatus.daysRemaining === 1 
              ? `⏰ Your ${platformName} Trial Ends Tomorrow`
              : `⏰ ${trialStatus.daysRemaining} Days Left in Your ${platformName} Trial`
            }
          </h3>
          <p style={{
            margin: 0,
            color: 'rgba(255,255,255,0.95)',
            fontSize: '15px',
            lineHeight: '1.5'
          }}>
            Continue for just <strong>{planPricing.price}/{planPricing.period}</strong>
            {planPricing.savings && ` (Save ${planPricing.savings})`}
          </p>
        </div>
        
        <button
          onClick={handleUpgrade}
          disabled={redirecting}
          style={{
            background: 'white',
            color: color,
            border: 'none',
            padding: '12px 28px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: redirecting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: redirecting ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!redirecting) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          {redirecting ? 'Redirecting...' : 'Upgrade Now'}
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}

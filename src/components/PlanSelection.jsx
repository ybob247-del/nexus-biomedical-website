import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PlanSelection({ platform, onClose, onSelectPlan }) {
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      await onSelectPlan(selectedPlan);
    } catch (error) {
      console.error('Error starting trial:', error);
      alert('Failed to start trial. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get pricing from platform data
  const professionalPlan = platform.pricing?.find(p => p.tier === 'Professional');
  const monthlyPrice = professionalPlan?.price || '$39';
  const yearlyPrice = Math.round(parseFloat(monthlyPrice.replace('$', '')) * 12 * 0.8); // 20% discount

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#FFFFFF',
      padding: '2rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto',
      zIndex: 1000
    }}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
          padding: '0.75rem 1.5rem',
          borderRadius: '30px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateX(-5px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        ← Back
      </button>

      {/* Content */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '6rem 2rem 4rem',
        textAlign: 'center'
      }}>
        {/* Platform Logo */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '2rem',
          boxShadow: `0 8px 32px ${platform.color}60`,
          padding: '1.5rem'
        }}>
          <img 
            src={`/logos/${platform.name.replace('™', '').replace(' ', '_')}_Logo_White_BG.png`}
            alt={`${platform.name} Logo`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div style="font-size: 3rem;">${platform.name.charAt(0)}</div>`;
            }}
          />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          marginBottom: '1rem',
          background: `linear-gradient(135deg, ${platform.color} 0%, #FFFFFF 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2
        }}>
          Choose Your Plan
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#B8D4E8',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>Start your {platform.trialDays || 14}-day free trial of {platform.name}. No credit card required.
        </p>

        {/* Plan Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '900px',
          margin: '0 auto 3rem'
        }}>
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            style={{
              background: selectedPlan === 'monthly' 
                ? `linear-gradient(135deg, ${platform.color}20 0%, ${platform.color}10 100%)`
                : 'rgba(255, 255, 255, 0.05)',
              border: selectedPlan === 'monthly'
                ? `3px solid ${platform.color}`
                : '3px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (selectedPlan !== 'monthly') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlan !== 'monthly') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {selectedPlan === 'monthly' && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: platform.color,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                ✓ Selected
              </div>
            )}

            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#FFFFFF'
            }}>
              Monthly
            </h3>

            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: platform.color,
              marginBottom: '0.5rem'
            }}>
              {monthlyPrice}
              <span style={{ fontSize: '1.2rem', fontWeight: 400, color: '#B8D4E8' }}>/month</span>
            </div>

            <p style={{
              color: '#B8D4E8',
              fontSize: '1rem',
              marginBottom: '1.5rem'
            }}>
              Billed monthly
            </p>

            <ul style={{
              textAlign: 'left',
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {professionalPlan?.features?.slice(0, 5).map((feature, idx) => (
                <li key={idx} style={{
                  padding: '0.75rem 0',
                  color: '#E2E8F0',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <span style={{ color: platform.color, fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Yearly Plan */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            style={{
              background: selectedPlan === 'yearly'
                ? `linear-gradient(135deg, ${platform.color}20 0%, ${platform.color}10 100%)`
                : 'rgba(255, 255, 255, 0.05)',
              border: selectedPlan === 'yearly'
                ? `3px solid ${platform.color}`
                : '3px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (selectedPlan !== 'yearly') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(-5px)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedPlan !== 'yearly') {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {/* Best Value Badge */}
            <div style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #FFB800 0%, #FF4757 100%)',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(255, 71, 87, 0.4)'
            }}>
              SAVE 20%
            </div>

            {selectedPlan === 'yearly' && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: platform.color,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 700
              }}>
                ✓ Selected
              </div>
            )}

            <h3 style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '1rem',
              color: '#FFFFFF',
              marginTop: '1rem'
            }}>
              Yearly
            </h3>

            <div style={{
              fontSize: '3rem',
              fontWeight: 800,
              color: platform.color,
              marginBottom: '0.5rem'
            }}>
              ${yearlyPrice}
              <span style={{ fontSize: '1.2rem', fontWeight: 400, color: '#B8D4E8' }}>/year</span>
            </div>

            <p style={{
              color: '#B8D4E8',
              fontSize: '1rem',
              marginBottom: '1.5rem'
            }}>
              ${Math.round(yearlyPrice / 12)}/month • Billed annually
            </p>

            <ul style={{
              textAlign: 'left',
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {professionalPlan?.features?.slice(0, 5).map((feature, idx) => (
                <li key={idx} style={{
                  padding: '0.75rem 0',
                  color: '#E2E8F0',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}>
                  <span style={{ color: platform.color, fontSize: '1.2rem', flexShrink: 0 }}>✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Start Trial Button */}
        <button
          onClick={handleStartTrial}
          disabled={loading}
          style={{
            background: platform.gradient,
            color: 'white',
            border: 'none',
            padding: '1.5rem 4rem',
            borderRadius: '50px',
            fontSize: '1.3rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: `0 8px 24px ${platform.color}60`,
            letterSpacing: '1px',
            opacity: loading ? 0.7 : 1
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${platform.color}80`;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${platform.color}60`;
            }
          }}
        >
          {loading ? 'Starting Trial...' : `Start ${platform.trialDays || 14}-Day Free Trial`}
        </button>

        <p style={{
          marginTop: '2rem',
          color: '#94A3B8',
          fontSize: '0.95rem'
        }}>
          No credit card required • Cancel anytime • Full access during trial
        </p>
      </div>
    </div>
  );
}

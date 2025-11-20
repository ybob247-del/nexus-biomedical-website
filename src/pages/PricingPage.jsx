import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { platformsData } from '../data/platformData';
import { STRIPE_PAYMENT_LINKS } from '../config/stripePaymentLinks';

const PricingPage = () => {
  const { platformId } = useParams();
  const navigate = useNavigate();
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [platformId]);
  
  // Get platform data
  const platformKey = Object.keys(platformsData).find(
    key => key.toLowerCase().replace(/™/g, '').replace(/\s+/g, '') === platformId.toLowerCase()
  );
  
  const platform = platformsData[platformKey];
  
  if (!platform) {
    return <div>Platform not found</div>;
  }

  const handleSelectPlan = (tier) => {
    if (tier.stripeKey && STRIPE_PAYMENT_LINKS[tier.stripeKey]) {
      // Check if it's a placeholder
      if (STRIPE_PAYMENT_LINKS[tier.stripeKey].startsWith('PLACEHOLDER_')) {
        alert('This payment option is being set up. Please contact support@nexusbiomedical.ai for immediate access.');
        return;
      }
      // Redirect to Stripe checkout
      window.location.href = STRIPE_PAYMENT_LINKS[tier.stripeKey];
    } else if (tier.price === '$0') {
      // Free tier - navigate to signup
      navigate('/signup');
    } else {
      // Contact sales for custom pricing
      navigate('/contact');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header />
      
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '8rem 2rem 4rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: platform.gradient,
            borderRadius: '50px',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {platform.badge}
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            background: `linear-gradient(135deg, ${platform.color} 0%, #FFFFFF 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            Choose Your {platform.name} Plan
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            {platform.tagline}
          </p>
        </div>

        {/* Pricing Tiers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: platform.pricing.length <= 3 ? 'repeat(auto-fit, minmax(300px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {platform.pricing.map((tier, index) => (
            <div
              key={index}
              style={{
                background: tier.highlight 
                  ? `linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)`
                  : 'rgba(10, 27, 61, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: tier.highlight 
                  ? `2px solid ${platform.color}`
                  : '1px solid rgba(96, 165, 250, 0.2)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                transform: tier.highlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}
            >
              {tier.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: platform.gradient,
                  color: '#FFFFFF',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Most Popular
                </div>
              )}
              
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '0.5rem',
                marginTop: tier.highlight ? '1rem' : '0'
              }}>
                {tier.tier}
              </h3>
              
              <div style={{
                marginBottom: '1.5rem'
              }}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: platform.color
                }}>
                  {tier.price}
                </span>
                <span style={{
                  fontSize: '1rem',
                  color: '#B8D4E8',
                  marginLeft: '0.5rem'
                }}>
                  {tier.period}
                </span>
              </div>
              
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 2rem 0',
                flex: 1
              }}>
                {tier.features.map((feature, fIndex) => (
                  <li key={fIndex} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    marginBottom: '0.75rem',
                    color: '#FFFFFF',
                    fontSize: '0.95rem',
                    lineHeight: 1.6
                  }}>
                    <span style={{
                      color: platform.color,
                      marginRight: '0.75rem',
                      fontSize: '1.25rem',
                      flexShrink: 0
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSelectPlan(tier)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: tier.highlight ? platform.gradient : 'rgba(96, 165, 250, 0.2)',
                  color: '#FFFFFF',
                  border: tier.highlight ? 'none' : `1px solid ${platform.color}`,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 8px 20px ${platform.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {tier.price === '$0' ? 'Get Started Free' : 
                 tier.price === 'Custom' ? 'Contact Sales' : 
                 'Start Free Trial'}
              </button>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div style={{
          textAlign: 'center',
          marginTop: '3rem'
        }}>
          <button
            onClick={() => navigate('/platforms')}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(96, 165, 250, 0.1)',
              color: '#60A5FA',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(96, 165, 250, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(96, 165, 250, 0.1)';
            }}
          >
            ← Back to All Platforms
          </button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage;

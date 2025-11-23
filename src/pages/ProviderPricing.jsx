/**
 * Provider Tier Pricing Page
 * Dedicated pricing page for healthcare providers
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProviderPricing = () => {
  const navigate = useNavigate();

  const providerTiers = [
    {
      name: 'Provider Basic',
      price: '$99',
      period: '/month',
      description: 'Perfect for individual practitioners and small clinics',
      features: [
        'Up to 50 patients per month',
        'Access to RxGuard™ and EndoGuard™',
        'Basic clinical reports',
        'Email support',
        'HIPAA-compliant pseudonymous design',
        'No BAA required',
        'Monthly usage analytics',
        'Standard updates'
      ],
      cta: 'Start 30-Day Trial',
      popular: false
    },
    {
      name: 'Provider Professional',
      price: '$199',
      period: '/month',
      description: 'Ideal for busy practices and healthcare systems',
      features: [
        'Unlimited patients',
        'Access to all platforms',
        'Advanced clinical reports with export',
        'Priority support (24/7)',
        'HIPAA-compliant pseudonymous design',
        'No BAA required',
        'Dedicated account manager',
        'Custom training sessions',
        'API access',
        'Early access to new features',
        'Bulk patient data import',
        'White-label options available'
      ],
      cta: 'Start 30-Day Trial',
      popular: true
    }
  ];

  const enterpriseFeatures = [
    'Custom patient volume pricing',
    'Dedicated infrastructure',
    'Custom integrations (EHR, PACS, etc.)',
    'On-site training and implementation',
    'SLA guarantees',
    'Custom reporting and analytics',
    'Multi-location support',
    'Volume discounts for healthcare systems'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a1b3d 0%, #1a2f5a 100%)',
      padding: '6rem 2rem 4rem'
    }}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: 500,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        ← Back to Home
      </button>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}>
            Healthcare Provider Pricing
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            Professional-grade clinical AI platforms designed for healthcare providers. 
            HIPAA-safe pseudonymous design means no BAA required.
          </p>
        </motion.div>

        {/* Pricing Tiers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          {providerTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: tier.popular 
                  ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: tier.popular 
                  ? '2px solid rgba(96, 165, 250, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '1rem',
                padding: '2.5rem',
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = tier.popular
                  ? '0 20px 40px rgba(96, 165, 250, 0.3)'
                  : '0 20px 40px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {tier.popular && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '20px',
                  background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '2rem',
                  fontSize: '0.875rem',
                  fontWeight: 600
                }}>
                  Most Popular
                </div>
              )}

              <h3 style={{
                fontSize: '1.75rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '0.5rem'
              }}>
                {tier.name}
              </h3>

              <p style={{
                color: '#B8D4E8',
                fontSize: '0.95rem',
                marginBottom: '1.5rem'
              }}>
                {tier.description}
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <span style={{
                  fontSize: '3rem',
                  fontWeight: 800,
                  color: 'white'
                }}>
                  {tier.price}
                </span>
                <span style={{
                  fontSize: '1.25rem',
                  color: '#B8D4E8'
                }}>
                  {tier.period}
                </span>
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: '2rem'
              }}>
                {tier.features.map((feature, i) => (
                  <li key={i} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    marginBottom: '0.75rem',
                    color: '#E2E8F0'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <circle cx="10" cy="10" r="10" fill="rgba(96, 165, 250, 0.2)" />
                      <path d="M6 10l3 3 5-6" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/signup')}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: tier.popular
                    ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: tier.popular ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '0.5rem',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = tier.popular
                    ? '0 10px 30px rgba(96, 165, 250, 0.4)'
                    : '0 10px 30px rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {tier.cta}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '1rem',
            padding: '3rem',
            textAlign: 'center'
          }}
        >
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '1rem'
          }}>
            Enterprise Solutions
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#B8D4E8',
            marginBottom: '2rem',
            maxWidth: '800px',
            margin: '0 auto 2rem'
          }}>
            Custom solutions for healthcare systems, hospitals, and large medical groups
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            {enterpriseFeatures.map((feature, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                color: '#E2E8F0'
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="10" cy="10" r="10" fill="rgba(168, 85, 247, 0.2)" />
                  <path d="M6 10l3 3 5-6" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/')}
            style={{
              padding: '1rem 2.5rem',
              background: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Contact Sales
          </button>
        </motion.div>

        {/* FAQ Section */}
        <div style={{
          marginTop: '4rem',
          padding: '3rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '1rem',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            Frequently Asked Questions
          </h2>

          <div style={{
            display: 'grid',
            gap: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            {[
              {
                q: 'Do I need a Business Associate Agreement (BAA)?',
                a: 'No! Our pseudonymous design means we never collect PHI or PII, so no BAA is required. You can use our platforms safely without HIPAA compliance obligations.'
              },
              {
                q: 'Can I use this with my existing EHR system?',
                a: 'Yes! Provider Professional tier includes API access for EHR integration. Our pseudonymous design means you can use case identifiers instead of patient names.'
              },
              {
                q: 'What happens after the 30-day trial?',
                a: 'Your subscription automatically begins at the end of the trial period. You can cancel anytime during the trial with no charges.'
              },
              {
                q: 'Do you offer training for my staff?',
                a: 'Yes! Provider Professional includes custom training sessions. Provider Basic includes comprehensive documentation and video tutorials.'
              },
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Absolutely! You can change your plan at any time. Upgrades take effect immediately, and downgrades apply at your next billing cycle.'
              }
            ].map((faq, i) => (
              <div key={i} style={{
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: 'white',
                  marginBottom: '0.75rem'
                }}>
                  {faq.q}
                </h3>
                <p style={{
                  color: '#B8D4E8',
                  lineHeight: 1.6
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPricing;

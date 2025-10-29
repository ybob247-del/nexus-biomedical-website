import React from 'react';

export default function LearnMore({ platform, onBack, onTryDemo }) {
  if (!platform) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A1B3D 0%, #1a2942 50%, #0A1B3D 100%)',
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
      {/* Back Button */}
      <button
        onClick={onBack}
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
        ← Back to Home
      </button>

      {/* Content Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '6rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{
            display: 'inline-block',
            background: platform.gradient,
            padding: '0.5rem 1.5rem',
            borderRadius: '30px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '1px'
          }}>
            {platform.badge}
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800,
            marginBottom: '1.5rem',
            background: `linear-gradient(135deg, ${platform.color} 0%, #FFFFFF 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2
          }}>
            {platform.hero.title}
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto 2rem',
            lineHeight: 1.6
          }}>
            {platform.hero.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {/* Show Try Demo button for all platforms */}
            {onTryDemo && (
              <button style={{
                background: platform.gradient,
                color: 'white',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 20px ${platform.color}40`
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              onClick={() => {
                const demoMap = {
                  'RxGuard™': 'rxguard',
                  'ReguReady™': 'reguready',
                  'ClinicalIQ™': 'clinicaliq',
                  'ElderWatch™': 'elderwatch',
                  'PediCalc Pro™': 'pedicalc',
                  'SkinScan Pro™': 'skinscan'
                };
                onTryDemo(demoMap[platform.name]);
              }}
              >
                🚀 Try Interactive Demo
              </button>
            )}
            <button style={{
              background: platform.gradient,
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 4px 20px ${platform.color}40`
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => window.location.href = `mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ${platform.name}`}
            >
              Start Free Trial
            </button>

          </div>
        </div>

        {/* Problem Statement */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1.5rem', color: platform.color }}>
            {platform.problem.title}
          </h2>
          {platform.problem.content.map((paragraph, idx) => (
            <p key={idx} style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.8, color: '#B8D4E8', marginBottom: '1rem' }}>
              {paragraph}
            </p>
          ))}
        </section>

        {/* How It Works */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            How {platform.name} Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {platform.howItWorks.map((item) => (
              <div key={item.step} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: platform.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: '1rem'
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: '#B8D4E8', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key Features */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            Key Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {platform.features.map((feature, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '0.75rem', color: platform.color }}>
                  ✓ {feature.title}
                </h3>
                <p style={{ color: '#B8D4E8', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Clinical Benefits */}
        <section style={{
          background: `linear-gradient(135deg, ${platform.color}33 0%, ${platform.color}22 100%)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${platform.color}44`,
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem)',
          marginBottom: '4rem'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            {platform.name.includes('Clinical') ? 'Business Benefits' : 'Clinical Benefits'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
            {platform.benefits.map((benefit, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: platform.color, marginBottom: '0.5rem' }}>
                  {benefit.stat}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{benefit.title}</h3>
                <p style={{ color: '#B8D4E8' }}>{benefit.desc}</p>
              </div>
            ))}
          </div>
          {platform.benefitsDisclaimer && (
            <p style={{ 
              marginTop: '2rem', 
              fontSize: '0.9rem', 
              color: '#B8D4E8', 
              fontStyle: 'italic', 
              textAlign: 'center',
              opacity: 0.8
            }}>
              * {platform.benefitsDisclaimer}
            </p>
          )}
        </section>

        {/* Pricing */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            Pricing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {platform.pricing.map((plan, idx) => (
              <div key={idx} style={{
                background: plan.highlight ? `linear-gradient(135deg, ${platform.color}33 0%, ${platform.color}22 100%)` : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: plan.highlight ? `2px solid ${platform.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2.5rem',
                position: 'relative'
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: platform.gradient,
                    padding: '0.5rem 1.5rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                    whiteSpace: 'nowrap'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem', textAlign: 'center' }}>{plan.tier}</h3>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: 'clamp(2.5rem, 4vw, 3rem)', fontWeight: 800, color: platform.color }}>{plan.price}</div>
                  <div style={{ color: '#B8D4E8' }}>{plan.period}</div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem', minHeight: '200px' }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ padding: '0.5rem 0', color: '#B8D4E8', display: 'flex', alignItems: 'start' }}>
                      <span style={{ color: platform.color, marginRight: '0.5rem' }}>✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button style={{
                  background: plan.highlight ? platform.gradient : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: plan.highlight ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '1rem 2rem',
                  borderRadius: '30px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => window.location.href = `mailto:support@nexusbiomedical.ai?subject=${plan.tier} Plan Inquiry - ${platform.name}`}
                >
                  {plan.tier === 'Free' || plan.tier === 'Starter' ? 'Get Started' : plan.tier.includes('Professional') ? 'Start Free Trial' : 'Contact Sales'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {platform.faqs.map((faq, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1rem', color: platform.color }}>{faq.q}</h3>
                <p style={{ color: '#B8D4E8', lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          background: platform.gradient,
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 4rem) 2rem',
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1rem' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', marginBottom: '2rem', opacity: 0.9 }}>
            Start your free trial today and see how {platform.name} can transform your practice.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: 'white',
              color: platform.color,
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => window.location.href = `mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ${platform.name}`}
            >
              Start Free Trial
            </button>

          </div>
        </section>

        {/* Contact */}
        <div style={{ textAlign: 'center', paddingBottom: '4rem' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 600, marginBottom: '1rem' }}>Get in Touch</h3>
          <p style={{ color: '#B8D4E8', marginBottom: '1rem' }}>
            <a href="mailto:support@nexusbiomedical.ai" style={{ color: platform.color, textDecoration: 'none' }}>
              support@nexusbiomedical.ai
            </a>
          </p>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>
            © 2025 Nexus Biomedical Intelligence. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}


import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { openPaymentLink } from '../config/stripePaymentLinks';
import { openEndoGuardPayment } from '../config/endoguardStripeLinks';
import { updateMetaTags, resetMetaTags } from '../config/seoMetadata';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LanguageToggle from './LanguageToggle';
import EndoGuardPhase1ConversionLayer from './EndoGuardPhase1ConversionLayer';

export default function LearnMore({ platform, onBack, onTryDemo }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { i18n } = useTranslation();
  
  // Redirect to Spanish landing page if language is Spanish and platform is EndoGuard
  useEffect(() => {
    if (i18n.language === 'es' && platform?.name === 'EndoGuard™') {
      navigate('/es/endoguard');
    }
  }, [i18n.language, platform, navigate]);
  
  // Map platform names to dashboard URLs
  const platformDashboards = {
    'RxGuard™': '/rxguard/dashboard',
    'EndoGuard™': '/endoguard/assessment',
    'ElderWatch™': '/elderwatch/dashboard',
    'PediCalc Pro™': '/pedicalc/dashboard',
    'ClinicalIQ™': '/clinicaliq/dashboard',
    'ReguReady™': '/reguready/dashboard',
    'SkinScan Pro™': '/skinscan/dashboard'
  };
  
  const handleGetStarted = () => {
    const dashboardUrl = platformDashboards[platform.name];
    
    // Hybrid freemium model for EndoGuard - allow unauthenticated assessment
    if (platform.name === 'EndoGuard™') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/endoguard/assessment');
      return;
    }
    
    if (isAuthenticated) {
      // User is logged in, go directly to platform
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(dashboardUrl);
    } else {
      // User not logged in - navigate to signup to get free trial
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/signup');
    }
  };
  // Update SEO meta tags when platform changes
  useEffect(() => {
    if (platform && platform.name) {
      updateMetaTags(platform.name);
    }
    
    // Cleanup: reset to homepage meta tags when component unmounts
    return () => {
      resetMetaTags();
    };
  }, [platform]);

  if (!platform) return null;

  // Special handling for Coming Soon platforms (EndoGuard™)
  if (platform.comingSoon) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'transparent',
        color: '#FFFFFF',
        padding: '2rem 1rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
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

        {/* Language Toggle */}
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          zIndex: 1001
        }}>
          <LanguageToggle />
        </div>

        {/* Coming Soon Content */}
        <div style={{ textAlign: 'center', maxWidth: '900px', padding: '2rem' }}>
          {/* Platform Logo */}
          <div style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3rem',
            boxShadow: `0 8px 32px ${platform.color}60`,
            padding: '2rem'
          }}>
            <img 
              src={`/logos/${platform.name.replace('™', '').replace(' ', '_')}_Logo_White_BG.png`}
              alt={`${platform.name} Logo`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Platform Name */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 800,
            marginBottom: '2rem',
            background: `linear-gradient(135deg, ${platform.color} 0%, #FFFFFF 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2
          }}>
            {platform.name}
          </h1>

          {/* COMING SOON Badge */}
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #FFB800 0%, #FF4757 100%)',
            padding: '2rem 4rem',
            borderRadius: '20px',
            marginBottom: '3rem',
            boxShadow: '0 8px 32px rgba(255, 71, 87, 0.4)'
          }}>
            <div style={{
              fontSize: 'clamp(2rem, 4vw, 4rem)',
              fontWeight: 900,
              color: 'white',
              letterSpacing: '4px',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
              COMING SOON
            </div>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
            color: platform.color,
            marginBottom: '2rem',
            fontWeight: 600,
            textShadow: `0 0 20px ${platform.color}80`
          }}>
            {platform.tagline}
          </p>

          {/* Description */}
          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.3rem)',
            color: '#B8D4E8',
            lineHeight: 1.8,
            marginBottom: '3rem',
            maxWidth: '700px',
            margin: '0 auto 3rem'
          }}>
            {platform.hero.subtitle}
          </p>

          {/* Join Waitlist Button */}
          <button
            onClick={() => window.location.href = `mailto:support@nexusbiomedical.ai?subject=EndoGuard™ Early Access Waitlist&body=I'm interested in early access to EndoGuard™. Please add me to the waitlist.`}
            style={{
              background: platform.gradient,
              color: 'white',
              border: 'none',
              padding: '1.5rem 3rem',
              borderRadius: '50px',
              fontSize: '1.3rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: `0 8px 24px ${platform.color}60`,
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 12px 32px ${platform.color}80`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${platform.color}60`;
            }}
          >
            🚀 Join Early Access Waitlist
          </button>

          {/* Additional Info */}
          <p style={{
            fontSize: '1rem',
            color: '#B8D4E8',
            marginTop: '3rem',
            fontStyle: 'italic'
          }}>
            EndoGuard™ is currently in development. Join our waitlist to be notified when beta testing begins.
          </p>
        </div>
      </div>
    );
  }

  // Handle Start Free Trial button clicks
  const handleStartTrial = () => {
    // For functional platforms, redirect to login/dashboard
    if (['RxGuard™', 'EndoGuard™'].includes(platform.name)) {
      handleGetStarted();
      return;
    }
    
    // RxGuard™ Professional - $49/month with 14-day trial
    if (platform.name === 'RxGuard™') {
      openPaymentLink('rxguard_professional');
    }
    // ReguReady™ - default to Starter plan ($199/month with 7-day trial)
    else if (platform.name === 'ReguReady™') {
      openPaymentLink('reguready_starter');
    }
    // ClinicalIQ™ - default to Starter plan ($299/month with 14-day trial)
    else if (platform.name === 'ClinicalIQ™') {
      openPaymentLink('clinicaliq_starter');
    }
    // ElderWatch™ - default to Home Care ($49/month with 14-day trial)
    else if (platform.name === 'ElderWatch™') {
      openPaymentLink('elderwatch_home');
    }
    // PediCalc Pro™ - Individual ($19.99/month with 14-day trial)
    else if (platform.name === 'PediCalc Pro™') {
      openPaymentLink('pedicalc_individual');
    }
    // SkinScan Pro™ - Individual Provider ($59/month with 14-day trial)
    else if (platform.name === 'SkinScan Pro™') {
      openPaymentLink('skinscan_individual');
    }
    // EndoGuard™ - Premium ($29/month with 14-day trial)
    else if (platform.name === 'EndoGuard™') {
      openEndoGuardPayment('premium_monthly');
    }
    // Fallback
    else {
      window.location.href = `mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ${platform.name}`;
    }
  };

  // Handle pricing card button clicks
  // Handle CTA navigation for Phase 1 Conversion Layer
  const handlePhase1CTA = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/endoguard/assessment');
  };

  const handlePricingClick = (plan) => {
    // For functional platforms, redirect to login/dashboard
    if (['RxGuard™', 'EndoGuard™'].includes(platform.name)) {
      handleGetStarted();
      return;
    }
    
    // RxGuard™
    if (platform.name === 'RxGuard™') {
      if (plan.tier === 'Professional') {
        openPaymentLink('rxguard_professional'); // $49/month with 14-day trial
      } else if (plan.tier === 'Enterprise') {
        window.location.href = 'mailto:support@nexusbiomedical.ai?subject=RxGuard Enterprise Inquiry';
      }
    }
    // ReguReady™
    else if (platform.name === 'ReguReady™') {
      if (plan.tier === 'Starter') {
        openPaymentLink('reguready_starter'); // $199/month with 7-day trial
      } else if (plan.tier === 'Professional') {
        openPaymentLink('reguready_professional'); // $399/month with 7-day trial
      } else if (plan.tier === 'Enterprise') {
        window.location.href = 'mailto:support@nexusbiomedical.ai?subject=ReguReady Enterprise Inquiry';
      }
    }
    // ClinicalIQ™
    else if (platform.name === 'ClinicalIQ™') {
      if (plan.tier === 'Starter') {
        openPaymentLink('clinicaliq_starter'); // $299/month with 14-day trial
      } else if (plan.tier === 'Professional') {
        openPaymentLink('clinicaliq_professional'); // $699/month with 14-day trial
      } else if (plan.tier === 'Enterprise') {
        window.location.href = 'mailto:support@nexusbiomedical.ai?subject=ClinicalIQ Enterprise Inquiry';
      }
    }
    // ElderWatch™
    else if (platform.name === 'ElderWatch™') {
      if (plan.tier === 'Home Care') {
        openPaymentLink('elderwatch_home'); // $49/month with 14-day trial
      } else if (plan.tier === 'Facility (10-50 residents)') {
        openPaymentLink('elderwatch_facility'); // $199/month with 14-day trial
      } else if (plan.tier === 'Enterprise (50+ residents)') {
        window.location.href = 'mailto:support@nexusbiomedical.ai?subject=ElderWatch Enterprise Inquiry';
      }
    }
    // PediCalc Pro™
    else if (platform.name === 'PediCalc Pro™') {
      if (plan.tier === 'Individual') {
        openPaymentLink('pedicalc_individual'); // $19.99/month with 14-day trial
      } else if (plan.tier === 'Group (5-20 providers)') {
        openPaymentLink('pedicalc_group'); // $14.99/provider/month with 14-day trial
      } else if (plan.tier === 'Hospital/Enterprise') {
        window.location.href = 'mailto:support@nexusbiomedical.ai?subject=PediCalc Pro Enterprise Inquiry';
      }
    }
    // SkinScan Pro™
    else if (platform.name === 'SkinScan Pro™') {
      if (plan.tier === 'Individual Provider') {
        openPaymentLink('skinscan_individual'); // $59/month with 14-day trial
      } else if (plan.tier === 'Group (5-20 providers)') {
        openPaymentLink('skinscan_group'); // $49/provider/month with 14-day trial
      } else if (plan.tier === 'Hospital/Enterprise') {
        window.location.href = 'mailto:support@nexusbiomedical.ai?subject=SkinScan Pro Enterprise Inquiry';
      }
    }
    // EndoGuard™
    else if (platform.name === 'EndoGuard™') {
      if (plan.tier === 'Free') {
        // Free tier - no payment needed, just redirect to signup
        window.location.href = '/beta-signup';
      } else if (plan.tier === 'Premium') {
        openEndoGuardPayment('premium_monthly'); // $29/month with 14-day trial
      } else if (plan.tier === 'Premium Plus') {
        openEndoGuardPayment('premium_plus_monthly'); // $49/month with 14-day trial
      } else if (plan.tier === 'Provider Basic') {
        openEndoGuardPayment('provider_basic_monthly'); // $99/month
      } else if (plan.tier === 'Provider Professional') {
        openEndoGuardPayment('provider_professional_monthly'); // $199/month
      } else if (plan.tier.includes('Enterprise') || plan.tier.includes('Partnership')) {
        window.location.href = 'mailto:sales@nexusbiomedical.ai?subject=EndoGuard Enterprise Partnership Inquiry';
      }
    }
    // Other platforms - email fallback
    else {
      window.location.href = `mailto:support@nexusbiomedical.ai?subject=${plan.tier} Plan Inquiry - ${platform.name}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
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

      {/* Language Toggle */}
      <div style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 1001
      }}>
        <LanguageToggle />
      </div>

      {/* Phase 1 Conversion Layer for EndoGuard - Mounted at top of landing page */}
      {platform.name === 'EndoGuard™' && <EndoGuardPhase1ConversionLayer />}

      {/* Content Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '6rem' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          {/* Platform Logo */}
          <div style={{
            width: '180px',
            height: '180px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '2rem',
            boxShadow: `0 8px 24px ${platform.color}40`,
            padding: '1.5rem'
          }}>
            <img 
              src={`/logos/${platform.name.replace('™', '').replace(' ', '_')}_Logo_White_BG.png`}
              alt={`${platform.name} Logo`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
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
          {platform.name === 'EndoGuard™' && (
            <>
              <p style={{
                fontSize: '1rem',
                color: '#B8D4E8',
                maxWidth: '700px',
                margin: '0 auto 1.5rem',
                fontWeight: 500
              }}>
                Designed to support primary care–led evaluation.
              </p>
              <p style={{
                fontSize: '0.95rem',
                color: '#B8D4E8',
                maxWidth: '700px',
                margin: '0 auto 2rem',
                fontStyle: 'italic',
                opacity: 0.85
              }}>
                If you’ve been told “your labs are normal” but you still don’t feel normal — start here.
              </p>
            </>
          )}
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
            onClick={() => {
              if (platform.name === 'EndoGuard™') {
                handleGetStarted();
              } else {
                handleStartTrial();
              }
            }}
            >
              {platform.name === 'EndoGuard™' ? 'Get My Hormone Risk Report' : 'Start Free Trial'}
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

        {/* Pricing - Hidden for EndoGuard Phase 1, shown for other platforms */}
        {platform.name !== 'EndoGuard™' && (
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
                onClick={() => handlePricingClick(plan)}
                >
                  {plan.tier.includes('Enterprise') || plan.tier.includes('Hospital') || plan.tier === 'Custom' ? 'Contact Sales' : plan.tier === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Phase 2 Coming Later - Only for EndoGuard */}
        {platform.name === 'EndoGuard™' && (
        <section style={{ marginBottom: '4rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#B8D4E8' }}>
              Phase 2 (Provider/Enterprise) - Coming Later
            </h3>
            <p style={{ color: '#B8D4E8', fontSize: '0.95rem', opacity: 0.8 }}>
              Provider dashboards, enterprise pricing, and clinical decision support tools will be available in Phase 2. Phase 1 focuses on your personalized hormone risk report.
            </p>
          </div>
        </section>
        )}

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
            {platform.name === 'EndoGuard™' ? 'Understand Your Hormone Risk' : 'Ready to Get Started?'}
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', marginBottom: '2rem', opacity: 0.9 }}>
            {platform.name === 'EndoGuard™' ? 'Get your personalized hormone risk report for $79 (one-time).' : `Start your free trial today and see how ${platform.name} can transform your practice.`}
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
            onClick={() => {
              if (platform.name === 'EndoGuard™') {
                handleGetStarted();
              } else {
                handleStartTrial();
              }
            }}
            >
              {platform.name === 'EndoGuard™' ? 'Get My Hormone Risk Report' : 'Start Free Trial'}
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


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
  const { i18n, t } = useTranslation();
  
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
        position: 'relative',
        overflowY: 'visible',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '100px',
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
          position: 'absolute',
          top: '100px',
          right: '2rem',
          zIndex: 1001
        }}>
          <LanguageToggle />
        </div>

        <div style={{
          textAlign: 'center',
          maxWidth: '800px'
        }}>
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
            marginBottom: '2rem',
            lineHeight: 1.6
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
      if (plan.tier === 'Free') {
        window.location.href = '/beta-signup';
      } else if (plan.tier === 'Professional') {
        openPaymentLink('rxguard_professional'); // $39/month with 14-day trial
      } else if (plan.tier === 'Enterprise') {
        window.location.href = 'mailto:sales@nexusbiomedical.ai?subject=RxGuard Enterprise Inquiry';
      }
    }
    // ReguReady™
    else if (platform.name === 'ReguReady™') {
      if (plan.tier === 'Starter') {
        openPaymentLink('reguready_starter'); // $199/month with 7-day trial
      } else if (plan.tier === 'Professional') {
        openPaymentLink('reguready_professional'); // $399/month with 7-day trial
      } else if (plan.tier === 'Enterprise') {
        window.location.href = 'mailto:sales@nexusbiomedical.ai?subject=ReguReady Enterprise Inquiry';
      }
    }
    // ClinicalIQ™
    else if (platform.name === 'ClinicalIQ™') {
      if (plan.tier === 'Starter') {
        openPaymentLink('clinicaliq_starter'); // $299/month with 14-day trial
      } else if (plan.tier === 'Professional') {
        openPaymentLink('clinicaliq_professional'); // $599/month with 14-day trial
      } else if (plan.tier === 'Enterprise') {
        window.location.href = 'mailto:sales@nexusbiomedical.ai?subject=ClinicalIQ Enterprise Inquiry';
      }
    }
    // ElderWatch™
    else if (platform.name === 'ElderWatch™') {
      if (plan.tier === 'Home Care') {
        openPaymentLink('elderwatch_home'); // $49/month with 14-day trial
      } else if (plan.tier === 'Assisted Living') {
        openPaymentLink('elderwatch_assisted'); // $99/month with 14-day trial
      } else if (plan.tier === 'Skilled Nursing') {
        window.location.href = 'mailto:sales@nexusbiomedical.ai?subject=ElderWatch Skilled Nursing Inquiry';
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
      if (plan.tier === 'Individual') {
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

  // Render EndoGuard using i18n keys
  if (platform.name === 'EndoGuard™') {
    return (
      <div style={{
        minHeight: 'auto',
        background: 'transparent',
        color: '#FFFFFF',
        padding: '2rem 1rem',
        position: 'relative',
        overflowY: 'visible',
        zIndex: 1
      }}>
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '100px',
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
          position: 'absolute',
          top: '100px',
          right: '2rem',
          zIndex: 1001
        }}>
          <LanguageToggle />
        </div>

        {/* Phase 1 Conversion Layer for EndoGuard - Mounted at top of landing page */}
        {platform.name === 'EndoGuard™' && <EndoGuardPhase1ConversionLayer />}

        {/* Content Container */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '8rem' }}>
          
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
              {t('endoguard.learnmore.hero.title')}
            </h1>
            <p style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              color: '#B8D4E8',
              maxWidth: '800px',
              margin: '0 auto 2rem',
              lineHeight: 1.6
            }}>
              {t('endoguard.learnmore.hero.subtitle')}
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
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
              onClick={handlePhase1CTA}
              >
                {t('endoguard.learnmore.cta.button')}
              </button>
            </div>
            <p style={{
              fontSize: '0.95rem',
              color: '#B8D4E8',
              maxWidth: '700px',
              margin: '1.5rem auto 0',
              fontWeight: 500
            }}>
              {t('endoguard.learnmore.hero.disclaimer1')}
            </p>
            <p style={{
              fontSize: '0.9rem',
              color: '#B8D4E8',
              maxWidth: '700px',
              margin: '1rem auto 0',
              fontStyle: 'italic',
              opacity: 0.85
            }}>
              {t('endoguard.learnmore.hero.disclaimer2')}
            </p>
          </div>

          {/* Problem Section */}
          <section style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '3rem'
          }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '1.5rem', color: platform.color }}>
              {t('endoguard.learnmore.problem.title')}
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.8, color: '#B8D4E8', marginBottom: '1rem' }}>
              {t('endoguard.learnmore.problem.p1')}
            </p>
            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', lineHeight: 1.8, color: '#B8D4E8', marginBottom: '1rem' }}>
              {t('endoguard.learnmore.problem.p2')}
            </p>
          </section>

          {/* How It Works */}
          <section style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
              {t('endoguard.learnmore.howItWorks.title')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {t('endoguard.learnmore.howItWorks.steps', { returnObjects: true }).map((item) => (
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
              {t('endoguard.learnmore.features.title')}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {t('endoguard.learnmore.features.items', { returnObjects: true }).map((feature, idx) => (
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

          {/* CTA Section */}
          <section style={{
            background: `linear-gradient(135deg, ${platform.color}20 0%, ${platform.color}10 100%)`,
            border: `1px solid ${platform.color}40`,
            borderRadius: '20px',
            padding: 'clamp(2rem, 4vw, 3rem)',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: '1rem', color: '#FFFFFF' }}>
              {t('endoguard.learnmore.cta.title')}
            </h2>
            <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: '#B8D4E8', marginBottom: '2rem', lineHeight: 1.6 }}>
              {t('endoguard.learnmore.cta.subtitle')}
            </p>
            <button
              onClick={handlePhase1CTA}
              style={{
                background: platform.gradient,
                color: 'white',
                border: 'none',
                padding: '1.2rem 3rem',
                borderRadius: '30px',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 8px 24px ${platform.color}40`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${platform.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${platform.color}40`;
              }}
            >
              {t('endoguard.learnmore.cta.button')}
            </button>
          </section>
        </div>
      </div>
    );
  }

  // For non-EndoGuard platforms, use existing platformData rendering
  return (
    <div style={{
      minHeight: 'auto',
      background: 'transparent',
      color: '#FFFFFF',
      padding: '2rem 1rem',
      position: 'relative',
      overflowY: 'visible',
      zIndex: 1
    }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          position: 'absolute',
          top: '100px',
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
        position: 'absolute',
        top: '100px',
        right: '2rem',
        zIndex: 1001
      }}>
        <LanguageToggle />
      </div>

      {/* Content Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '8rem' }}>
        
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
          {platform.name === 'RxGuard™' && (
            <div style={{
              display: 'inline-block',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '1rem 2rem',
              borderRadius: '20px',
              marginBottom: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '2px'
              }}>
                Coming Soon
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>

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
            onClick={handleStartTrial}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Problem Section */}
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


        {/* Pricing - Hidden for EndoGuard Phase 1, shown for other platforms */}
        {platform.name !== 'EndoGuard™' && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            Pricing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {platform.pricing.map((plan, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: plan.highlight ? `2px solid ${platform.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                position: 'relative',
                transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease'
              }}>
                {plan.highlight && (
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: platform.gradient,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    letterSpacing: '1px'
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.tier}</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 800, color: platform.color, marginBottom: '0.5rem' }}>
                  {plan.price}
                </p>
                <p style={{ fontSize: '1rem', color: '#B8D4E8', marginBottom: '1.5rem' }}>{plan.period}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} style={{ fontSize: '0.95rem', color: '#B8D4E8', marginBottom: '0.75rem', paddingLeft: '1.5rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: 0, color: platform.color }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePricingClick(plan)}
                  style={{
                    width: '100%',
                    background: plan.highlight ? platform.gradient : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: plan.highlight ? 'none' : `1px solid ${platform.color}`,
                    padding: '1rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${platform.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {plan.tier === 'Free' ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* FAQ Section */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {platform.faqs.map((faq, idx) => (
              <details key={idx} style={{
                marginBottom: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                padding: '1.5rem',
                cursor: 'pointer'
              }}>
                <summary style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: platform.color,
                  userSelect: 'none'
                }}>
                  {faq.q}
                </summary>
                <p style={{
                  fontSize: '1rem',
                  color: '#B8D4E8',
                  marginTop: '1rem',
                  lineHeight: 1.6
                }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

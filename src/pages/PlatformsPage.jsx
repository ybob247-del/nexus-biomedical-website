import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ComingSoonModal from '../components/ComingSoonModal';

const platforms = [
  {
    name: 'EndoGuard™',
    tagline: 'Clinical-Grade Hormone Intelligence Platform',
    description: 'Clinical-grade hormone intelligence addressing the silent health crisis from microplastics, endocrine-disrupting chemicals, and environmental exposures.',
    color: '#00CED1',
    gradient: 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)',
    stripeKey: 'endoguard_premium',
    price: '$29/month',
    trial: '14-day free trial',
    comingSoon: false
  },
  {
    name: 'RxGuard™',
    tagline: 'Medication Interaction Predictor',
    description: 'AI-powered medication interaction checker that helps healthcare providers identify dangerous drug combinations and suggest safer alternatives.',
    color: '#00A8CC',
    gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
    stripeKey: 'rxguard_professional',
    price: '$39/month',
    trial: '14-day free trial',
    comingSoon: false
  },
  {
    name: 'ElderWatch™',
    tagline: 'Senior Health Monitoring',
    description: 'Predictive health analytics platform that uses AI to monitor senior patients and predict health decline before symptoms emerge.',
    color: '#FB923C',
    gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
    stripeKey: null,
    price: 'Coming Soon',
    trial: '',
    comingSoon: true
  },
  {
    name: 'PediCalc Pro™',
    tagline: 'Pediatric Medication Dosing',
    description: 'AI-enhanced pediatric medication dosing calculator that provides precise, weight-based dosing recommendations with built-in safety verification.',
    color: '#FDA4AF',
    gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 100%)',
    stripeKey: null,
    price: 'Coming Soon',
    trial: '',
    comingSoon: true
  },
  {
    name: 'ClinicalIQ™',
    tagline: 'Clinical Decision Support System',
    description: 'AI-driven clinical decision support platform that analyzes patient data to provide evidence-based treatment recommendations.',
    color: '#00D084',
    gradient: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)',
    stripeKey: null,
    price: 'Coming Soon',
    trial: '',
    comingSoon: true
  },
  {
    name: 'ReguReady™',
    tagline: 'FDA Regulatory Guidance Platform',
    description: 'AI-powered regulatory guidance platform that helps medical device companies navigate FDA pathways and accelerate product approvals.',
    color: '#B794F4',
    gradient: 'linear-gradient(135deg, #B794F4 0%, #9F7AEA 100%)',
    stripeKey: null,
    price: 'Coming Soon',
    trial: '',
    comingSoon: true
  },
  {
    name: 'SkinScan Pro™',
    tagline: 'AI Skin Cancer Detection',
    description: 'AI-powered skin cancer detection platform that analyzes skin lesions using computer vision to assist in early melanoma identification.',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    stripeKey: null,
    price: 'Coming Soon',
    trial: '',
    comingSoon: true
  }
];

export default function PlatformsPage() {
  const navigate = useNavigate();
  const [waitlistPlatform, setWaitlistPlatform] = useState(null);
  
  const handleStartTrial = (platform) => {
    if (platform.comingSoon) {
      // Show waitlist modal for coming soon platforms
      setWaitlistPlatform(platform);
      return;
    }

    // Navigate to signup for active platforms (RxGuard and EndoGuard)
    navigate('/signup');
  };

  return (
    <>
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #0a1b3d 0%, #1a2f5a 100%)',
      padding: '6rem 2rem 4rem',
      position: 'relative'
    }}>
      {/* Back to Home Button */}
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

      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', marginBottom: '4rem', textAlign: 'center' }}>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}
        >
          Choose Your Platform
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}
        >
          Select the AI healthcare platform that fits your needs. All plans include a free trial with no credit card required.
        </motion.p>
      </div>

      {/* Platform Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {platforms.map((platform, index) => (
          <motion.div
            key={platform.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{
              background: 'rgba(10, 27, 61, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(96, 165, 250, 0.2)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              opacity: platform.comingSoon ? 0.7 : 1
            }}
            whileHover={{
              scale: platform.comingSoon ? 1 : 1.02,
              borderColor: platform.color,
              boxShadow: platform.comingSoon ? 'none' : `0 10px 40px ${platform.color}40`
            }}
          >
            {/* Coming Soon Badge */}
            {platform.comingSoon && (
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                zIndex: 10
              }}>
                Coming Soon
              </div>
            )}

            {/* Gradient accent bar */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: platform.gradient,
              boxShadow: `0 0 20px ${platform.color}`
            }}></div>

            {/* Platform Logo */}
            <div style={{
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: '1rem',
              margin: '0 auto 1.5rem'
            }}>
              <img 
                src={`/logos/${platform.name.replace('™', '').replace(' ', '_')}_Logo_White_BG.png`}
                alt={`${platform.name} Logo`}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            {/* Platform Name */}
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {platform.name}
            </h3>

            {/* Tagline */}
            <p style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: platform.color,
              marginBottom: '1.25rem',
              textAlign: 'center',
              textShadow: `0 0 20px ${platform.color}80`
            }}>
              {platform.tagline}
            </p>

            {/* Description */}
            <p style={{
              fontSize: '0.95rem',
              color: '#B8D4E8',
              lineHeight: 1.7,
              marginBottom: '2rem',
              textAlign: 'center',
              minHeight: '80px'
            }}>
              {platform.description}
            </p>

            {/* Beta Testing Notice */}
            {!platform.comingSoon && (
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(255, 165, 0, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 165, 0, 0.3)'
              }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#FFA500',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Beta Testing in Progress
                </div>
              </div>
            )}

            {/* CTA Button */}
            <button
              onClick={() => handleStartTrial(platform)}
              style={{
                background: platform.comingSoon ? 'rgba(255, 255, 255, 0.1)' : platform.gradient,
                color: 'white',
                border: platform.comingSoon ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
                borderRadius: '30px',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: platform.comingSoon ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: platform.comingSoon ? 'none' : `0 4px 15px ${platform.color}40`,
                width: '100%',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => {
                if (!platform.comingSoon) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${platform.color}60`;
                }
              }}
              onMouseLeave={(e) => {
                if (!platform.comingSoon) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${platform.color}40`;
                }
              }}
            >
              {platform.comingSoon ? 'Join Waitlist →' : 'Start Free Trial →'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <div style={{
        maxWidth: '800px',
        margin: '4rem auto 0',
        textAlign: 'center',
        padding: '2rem',
        background: 'rgba(96, 165, 250, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(96, 165, 250, 0.2)'
      }}>
        <p style={{
          fontSize: '1rem',
          color: '#FFFFFF',
          marginBottom: '0.5rem',
          fontWeight: 600
        }}>
          🎉 All plans include a free trial with no credit card required
        </p>
        <p style={{
          fontSize: '0.875rem',
          color: '#B8D4E8'
        }}>
          Cancel anytime. No commitments. Start improving patient care today.
        </p>
      </div>
    </div>
    
    {/* Coming Soon Modal */}
    {waitlistPlatform && (
      <ComingSoonModal
        platform={waitlistPlatform}
        onClose={() => setWaitlistPlatform(null)}
      />
    )}
    </>
  );
}

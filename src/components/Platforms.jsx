import React from 'react'
import { platformIcons } from './PlatformIcons'

const platforms = [
  {
    name: 'EndoGuard™',
    tagline: 'Clinical-Grade Hormone Intelligence Platform',
    description: 'Clinical-grade hormone intelligence addressing the silent health crisis from microplastics, endocrine-disrupting chemicals, and environmental exposures.',
    color: '#00CED1',
    gradient: 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)',
    comingSoon: false
  },
  {
    name: 'RxGuard™',
    tagline: 'Medication Interaction Predictor',
    description: 'AI-powered medication interaction checker that helps healthcare providers identify dangerous drug combinations and suggest safer alternatives.',
    color: '#00A8CC',
    gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
    comingSoon: false
  },
  {
    name: 'ElderWatch™',
    tagline: 'Senior Health Monitoring',
    description: 'Predictive health analytics platform that uses AI to monitor senior patients and predict health decline before symptoms emerge, enabling proactive intervention.',
    color: '#FB923C',
    gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
    comingSoon: true
  },
  {
    name: 'PediCalc Pro™',
    tagline: 'Pediatric Medication Dosing',
    description: 'AI-enhanced pediatric medication dosing calculator that provides precise, weight-based dosing recommendations with built-in safety verification for children.',
    color: '#FDA4AF',
    gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 100%)',
    comingSoon: true
  },
  {
    name: 'ClinicalIQ™',
    tagline: 'Clinical Decision Support System',
    description: 'AI-driven clinical decision support platform that analyzes patient data to provide evidence-based treatment recommendations and optimize clinical trial design.',
    color: '#00D084',
    gradient: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)',
    comingSoon: true
  },
  {
    name: 'ReguReady™',
    tagline: 'FDA Regulatory Guidance Platform',
    description: 'AI-powered regulatory guidance platform that helps medical device companies navigate FDA pathways and accelerate product approvals through intelligent compliance analysis.',
    color: '#B794F4',
    gradient: 'linear-gradient(135deg, #B794F4 0%, #9F7AEA 100%)',
    comingSoon: true
  },
  {
    name: 'SkinScan Pro™',
    tagline: 'AI Skin Cancer Detection',
    description: 'AI-powered skin cancer detection platform that analyzes skin lesions using computer vision to assist healthcare providers in early melanoma identification.',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    comingSoon: true
  }
]

export default function Platforms({ onLearnMore }) {
  return (
    <section id="platforms" style={{
      padding: '4rem 2rem',
      background: 'rgba(10, 27, 61, 0.03)',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="container">
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 800,
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          Our AI Healthcare Platforms
        </h2>
        <p style={{
          fontSize: '1.25rem',
          textAlign: 'center',
          color: '#B8D4E8',
          marginBottom: '4rem',
          maxWidth: '700px',
          margin: '0 auto 4rem',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
        }}>
          Seven revolutionary platforms addressing critical gaps in healthcare delivery
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: '2rem',
          padding: '0 0.5rem'
        }}>
          {platforms.map((platform, index) => (
            <div 
              key={index} 
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2.5rem',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${platform.color}40`;
                e.currentTarget.style.borderColor = platform.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              {/* Gradient accent bar - Enhanced visibility */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: platform.gradient,
                boxShadow: `0 0 20px ${platform.color}, 0 4px 10px ${platform.color}80`
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
                padding: '1rem'
              }}>
                <img 
                  src={`/logos/${platform.name.replace('™', '').replace(' ', '_')}_Logo_White_BG.png`}
                  alt={`${platform.name} Logo`}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              
              {/* Platform header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#FFFFFF',
                  letterSpacing: '-0.5px'
                }}>
                  {platform.name}
                </h3>
                {platform.comingSoon && (
                  <span style={{
                    background: 'linear-gradient(135deg, #FFB800 0%, #FF4757 100%)',
                    color: 'white',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}>
                    Coming Soon
                  </span>
                )}
              </div>
              
              {/* Tagline - Enhanced contrast */}
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: platform.color,
                marginBottom: '1.25rem',
                letterSpacing: '0.3px',
                textShadow: `0 0 20px ${platform.color}80, 0 2px 4px rgba(0, 0, 0, 0.5)`,
                filter: 'brightness(1.3)'
              }}>
                {platform.tagline}
              </p>
              
              {/* Description */}
              <p style={{
                fontSize: '0.95rem',
                color: '#B8D4E8',
                lineHeight: 1.7,
                marginBottom: '2rem'
              }}>
                {platform.description}
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => onLearnMore && onLearnMore(platform.name)} 
                style={{
                  background: platform.gradient,
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '0.85rem 2rem',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 15px ${platform.color}40`,
                  width: '100%',
                  letterSpacing: '0.5px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${platform.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${platform.color}40`;
                }}
              >
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


import React from 'react'
import { platformIcons } from './PlatformIcons'

const platforms = [
  {
    name: 'RxGuard™',
    tagline: 'Medication Interaction Predictor',
    description: 'AI-powered medication interaction checker that helps healthcare providers identify dangerous drug combinations and suggest safer alternatives.',
    color: '#00A8CC',
    gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)'
  },
  {
    name: 'ClinicalIQ™',
    tagline: 'Clinical Decision Support System',
    description: 'AI-driven clinical decision support platform that analyzes patient data to provide evidence-based treatment recommendations and optimize clinical trial design.',
    color: '#00D084',
    gradient: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)'
  },
  {
    name: 'ReguReady™',
    tagline: 'FDA Regulatory Guidance Platform',
    description: 'AI-powered regulatory guidance platform that helps medical device companies navigate FDA pathways and accelerate product approvals through intelligent compliance analysis.',
    color: '#5B2C87',
    gradient: 'linear-gradient(135deg, #5B2C87 0%, #4A2470 100%)'
  },
  {
    name: 'ElderWatch™',
    tagline: 'Senior Health Monitoring',
    description: 'Predictive health analytics platform that uses AI to monitor senior patients and predict health decline before symptoms emerge, enabling proactive intervention.',
    color: '#FFB800',
    gradient: 'linear-gradient(135deg, #FFB800 0%, #E6A700 100%)'
  },
  {
    name: 'PediCalc Pro™',
    tagline: 'Pediatric Medication Dosing',
    description: 'AI-enhanced pediatric medication dosing calculator that provides precise, weight-based dosing recommendations with built-in safety verification for children.',
    color: '#FF4757',
    gradient: 'linear-gradient(135deg, #FF4757 0%, #E63946 100%)'
  },
  {
    name: 'SkinScan Pro™',
    tagline: 'AI Skin Cancer Detection',
    description: 'AI-powered skin cancer detection platform that analyzes skin lesions using computer vision to assist healthcare providers in early melanoma identification.',
    color: '#0A1B3D',
    gradient: 'linear-gradient(135deg, #0A1B3D 0%, #1a2942 100%)'
  }
]

export default function Platforms() {
  return (
    <section id="platforms" style={{
      padding: '6rem 2rem',
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
          Six revolutionary platforms addressing critical gaps in healthcare delivery
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2rem'
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
              {/* Gradient accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: platform.gradient
              }}></div>
              
              {/* Platform Icon */}
              <div style={{
                width: '64px',
                height: '64px',
                background: `${platform.color}15`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                border: `2px solid ${platform.color}30`
              }}>
                {React.createElement(platformIcons[platform.name], { color: platform.color, size: 40 })}
              </div>
              
              {/* Platform header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#FFFFFF',
                  letterSpacing: '-0.5px'
                }}>
                  {platform.name}
                </h3>
                <span style={{
                  background: 'linear-gradient(135deg, #FFB800 0%, #FF4757 100%)',
                  color: 'white',
                  padding: '0.4rem 0.9rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)'
                }}>
                  Coming Soon
                </span>
              </div>
              
              {/* Tagline */}
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: platform.color,
                marginBottom: '1.25rem',
                letterSpacing: '0.3px'
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


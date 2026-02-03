import React from 'react'
import { useTranslation } from 'react-i18next'
import { platformIcons } from './PlatformIcons'

export default function Platforms({ onLearnMore }) {
  const { t } = useTranslation()
  
  const platforms = [
    {
      name: 'EndoGuard™',
      taglineKey: 'platforms.endoguard.tagline',
      descriptionKey: 'platforms.endoguard.description',
      color: '#D946EF',
      gradient: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
      comingSoon: false
    },
    {
      name: 'RxGuard™',
      taglineKey: 'platforms.rxguard.tagline',
      descriptionKey: 'platforms.rxguard.description',
      color: '#00A8CC',
      gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
      comingSoon: true
    },
    {
      name: 'ReguReady™',
      taglineKey: 'platforms.reguready.tagline',
      descriptionKey: 'platforms.reguready.description',
      color: '#B794F4',
      gradient: 'linear-gradient(135deg, #B794F4 0%, #9F7AEA 100%)',
      comingSoon: true
    },
    {
      name: 'ClinicalIQ™',
      taglineKey: 'platforms.clinicaliq.tagline',
      descriptionKey: 'platforms.clinicaliq.description',
      color: '#00D084',
      gradient: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)',
      comingSoon: true
    },
    {
      name: 'ElderWatch™',
      taglineKey: 'platforms.elderwatch.tagline',
      descriptionKey: 'platforms.elderwatch.description',
      color: '#FB923C',
      gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      comingSoon: true
    },
    {
      name: 'PediCalc Pro™',
      taglineKey: 'platforms.pedicalc.tagline',
      descriptionKey: 'platforms.pedicalc.description',
      color: '#FDA4AF',
      gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 100%)',
      comingSoon: true
    },
    {
      name: 'SkinScan Pro™',
      taglineKey: 'platforms.skinscan.tagline',
      descriptionKey: 'platforms.skinscan.description',
      color: '#14B8A6',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      comingSoon: true
    }
  ]

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
          {t('platforms.title')}
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
          {t('platforms.subtitle')}
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
                  loading="lazy"
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
                    {t('platforms.comingSoon')}
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
                {t(platform.taglineKey)}
              </p>
              
              {/* Description */}
              <p style={{
                fontSize: '0.95rem',
                color: '#B8D4E8',
                lineHeight: 1.7,
                marginBottom: '2rem'
              }}>
                {t(platform.descriptionKey)}
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
                {t('platforms.learnMore')} →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContactForm from './ContactForm';

export default function Hero() {
  const { t } = useTranslation();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  
  return (
    <section style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem',
      position: 'relative',
      zIndex: 1
    }}>
      <div className="container">
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800,
          marginBottom: '1.5rem',
          lineHeight: 1.1,
          position: 'relative'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #00D9FF 40%, #7B3FFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'brightness(1.2) contrast(1.1)',
            textShadow: 'none',
            position: 'relative',
            display: 'inline-block'
          }}>
            <span style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #00D9FF 40%, #7B3FFF 100%)',
              filter: 'blur(20px)',
              opacity: 0.4,
              zIndex: -1
            }}></span>
            {t('hero.title')}
          </span>
        </h1>
        <p style={{
          fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
          color: '#E8F4FD',
          marginBottom: '2rem',
          maxWidth: '800px',
          margin: '0 auto 2rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
        }}>
          {t('hero.subtitle')}
        </p>
        <p style={{
          fontSize: '1.125rem',
          color: '#B8D4E8',
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
        }}>
          {t('hero.description')}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <button 
            className="nexus-button" 
            onClick={() => document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'linear-gradient(135deg, #00A8CC 0%, #5B2C87 100%)',
              color: '#FFFFFF',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 168, 204, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {t('hero.exploreButton')}
          </button>
          <button 
            className="nexus-button" 
            onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Sales%20Inquiry%20%E2%80%93%20Nexus%20Biomedical%20Intelligence&body=Hello%2C%0A%0AI%20am%20interested%20in%20learning%20more%20about%20Nexus%20Biomedical%20Intelligence%20platforms%20for%20my%20organization.%0A%0APlease%20contact%20me%20to%20discuss%20options.%0A%0AThank%20you.'}
            style={{
              background: 'linear-gradient(135deg, #00A8CC 0%, #5B2C87 100%)',
              color: '#FFFFFF',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 168, 204, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {t('hero.contactSales')}
          </button>
          <button 
            className="nexus-button" 
            onClick={() => document.querySelector('.faq-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'linear-gradient(135deg, #00A8CC 0%, #5B2C87 100%)',
              color: '#FFFFFF',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 168, 204, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {t('faq.hardQuestionsButton')}
          </button>
          <button 
            className="nexus-button" 
            onClick={() => setIsContactFormOpen(true)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#B8D4E8',
              padding: '0.75rem 1.75rem',
              fontSize: '0.95rem',
              fontWeight: 500,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease'
            }}
          >
            {t('nav.contact')}
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
    </section>
  )
}

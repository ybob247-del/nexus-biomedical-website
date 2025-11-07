import React, { useState } from 'react';
import ContactForm from './ContactForm';

export default function Hero() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  return (
    <section style={{
      minHeight: '100vh',
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
            Nexus Biomedical Intelligence
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
          Revolutionary AI Healthcare Platforms Transforming Patient Safety and Clinical Excellence
        </p>
        <p style={{
          fontSize: '1.125rem',
          color: '#B8D4E8',
          marginBottom: '3rem',
          maxWidth: '700px',
          margin: '0 auto 3rem',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
        }}>
          Six groundbreaking AI platforms addressing critical healthcare challenges from medication safety to skin cancer detection
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
            Explore Our Platforms
          </button>
          <button 
            className="nexus-button" 
            onClick={() => window.open('https://calendly.com/nexusbiomedical-ai/30min', '_blank')}
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
            Schedule Consultation
          </button>
          <button 
            className="nexus-button" 
            onClick={() => document.querySelector('.faq-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
              color: '#FFFFFF',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            Hard Questions Answered
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
            Contact Us
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


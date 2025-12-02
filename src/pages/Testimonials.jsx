import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/testimonials.css';

const Testimonials = () => {
  const { t } = useTranslation();

  // Beta phase - inviting real testimonials
  const betaInvitation = {
    title: t('testimonials.beta.title'),
    subtitle: t('testimonials.beta.subtitle'),
    message: t('testimonials.beta.message')
  };

  // Placeholder for future testimonials
  const testimonials = [
    {
      id: 1,
      name: t('testimonials.placeholders.name'),
      role: t('testimonials.placeholders.role'),
      organization: t('testimonials.placeholders.organization'),
      platform: t('testimonials.placeholders.platform'),
      quote: t('testimonials.placeholders.quote1'),
      rating: 5,
      image: null,
      isPlaceholder: true
    },
    {
      id: 2,
      name: t('testimonials.placeholders.name'),
      role: t('testimonials.placeholders.role'),
      organization: t('testimonials.placeholders.organization'),
      platform: t('testimonials.placeholders.platform'),
      quote: t('testimonials.placeholders.quote2'),
      rating: 5,
      image: null,
      isPlaceholder: true
    },
    {
      id: 3,
      name: t('testimonials.placeholders.name'),
      role: t('testimonials.placeholders.role'),
      organization: t('testimonials.placeholders.organization'),
      platform: t('testimonials.placeholders.platform'),
      quote: t('testimonials.placeholders.quote3'),
      rating: 5,
      image: null,
      isPlaceholder: true
    }
  ];

  // Beta stats - realistic for early access phase
  const stats = [
    { value: t('testimonials.stats.earlyAccess'), label: t('testimonials.stats.betaPhase') },
    { value: t('testimonials.stats.platforms'), label: t('testimonials.stats.currentlyLive') },
    { value: t('testimonials.stats.growing'), label: t('testimonials.stats.communityTesters') },
    { value: t('testimonials.stats.yourFeedback'), label: t('testimonials.stats.shapeFuture') }
  ];

  return (
    <div className="testimonials-page">
      {/* Animated Background */}
      <div className="testimonials-background">
        <div className="gradient-blob blob-1"></div>
        <div className="gradient-blob blob-2"></div>
        <div className="gradient-blob blob-3"></div>
      </div>

      {/* Hero Section */}
      <section className="testimonials-hero">
        <div className="testimonials-hero-content">
          <button 
            onClick={() => window.location.href = '/'} 
            className="back-to-home-btn"
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '12px 24px',
              background: 'rgba(0, 217, 255, 0.1)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '8px',
              color: '#00D9FF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(12px)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(0, 217, 255, 0.2)';
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(0, 217, 255, 0.1)';
              e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)';
            }}
          >
            {t('testimonials.backToHome')}
          </button>
          
          {/* Beta Badge */}
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(217, 70, 239, 0.2))',
            border: '1px solid rgba(0, 217, 255, 0.4)',
            borderRadius: '20px',
            color: '#00D9FF',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '20px',
            backdropFilter: 'blur(12px)'
          }}>
            {t('testimonials.betaBadge')}
          </div>
          
          <h1 className="testimonials-title">
            {betaInvitation.title}
            <span className="gradient-text"> {t('testimonials.together')}</span>
          </h1>
          <p className="testimonials-subtitle">
            {betaInvitation.subtitle}
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '800px',
            margin: '20px auto 0',
            lineHeight: '1.6'
          }}>
            {betaInvitation.message}
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="testimonials-stats">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value gradient-text">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Grid - Placeholder with CTA */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">{t('testimonials.yourStory.title')}</h2>
          <p className="section-subtitle">{t('testimonials.yourStory.subtitle')}</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card" style={{
              opacity: 0.7,
              border: '2px dashed rgba(0, 217, 255, 0.3)'
            }}>
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <div className="avatar-placeholder" style={{
                    background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(217, 70, 239, 0.2))',
                    fontSize: '2rem'
                  }}>
                    ?
                  </div>
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {testimonial.name}
                  </h3>
                  <p className="testimonial-role" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    {testimonial.role}
                  </p>
                  <p className="testimonial-org" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                    {testimonial.organization}
                  </p>
                </div>
              </div>

              <div className="testimonial-platform-badge" style={{
                background: 'rgba(0, 217, 255, 0.1)',
                borderColor: 'rgba(0, 217, 255, 0.3)'
              }}>
                {testimonial.platform}
              </div>

              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star" style={{ color: 'rgba(255, 215, 0, 0.4)' }}>★</span>
                ))}
              </div>

              <blockquote className="testimonial-quote" style={{
                fontStyle: 'italic',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                "{testimonial.quote}"
              </blockquote>
              
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: 'rgba(0, 217, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(0, 217, 255, 0.2)'
              }}>
                <a href="mailto:support@nexusbiomedical.ai?subject=Testimonial Submission" style={{
                  color: '#00D9FF',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}>
                  {t('testimonials.submitTestimonial')}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Share Section */}
      <section className="coming-soon-section">
        <div className="coming-soon-card">
          <div className="coming-soon-icon">{t('testimonials.share.icon')}</div>
          <h2 className="coming-soon-title">{t('testimonials.share.title')}</h2>
          <p className="coming-soon-text">
            {t('testimonials.share.description')}
          </p>
          
          <div style={{
            marginTop: '30px',
            padding: '25px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{
              fontSize: '1.3rem',
              color: '#00D9FF',
              marginBottom: '15px'
            }}>
              {t('testimonials.share.whatToInclude')}
            </h3>
            <ul style={{
              textAlign: 'left',
              maxWidth: '600px',
              margin: '0 auto',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1rem',
              lineHeight: '1.8'
            }}>
              {t('testimonials.share.items', { returnObjects: true }).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="coming-soon-cta" style={{ marginTop: '30px' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{t('testimonials.readyToShare')}</p>
            <a href="mailto:support@nexusbiomedical.ai?subject=Testimonial Submission&body=Platform Used: [RxGuard or EndoGuard]%0D%0A%0D%0AMy Experience:%0D%0A%0D%0AHow It's Helping:%0D%0A%0D%0AFavorite Features:%0D%0A%0D%0ASuggestions:%0D%0A%0D%0AName:%0D%0ARole:%0D%0AOrganization:" className="cta-button">
              {t('testimonials.submitButton')}
            </a>
          </div>
        </div>
      </section>

      {/* Video Testimonials Coming Soon */}
      <section className="coming-soon-section" style={{ paddingTop: '40px' }}>
        <div className="coming-soon-card">
          <div className="coming-soon-icon">{t('testimonials.video.icon')}</div>
          <h2 className="coming-soon-title">{t('testimonials.video.title')}</h2>
          <p className="coming-soon-text">
            {t('testimonials.video.description')}
          </p>
          <div className="coming-soon-cta">
            <a href="mailto:support@nexusbiomedical.ai?subject=Video Testimonial Interest" className="cta-button">
              {t('testimonials.video.expressInterest')}
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="testimonials-cta">
        <div className="cta-content">
          <h2 className="cta-title">{t('testimonials.cta.title')}</h2>
          <p className="cta-subtitle">{t('testimonials.cta.subtitle')}</p>
          <div className="cta-buttons">
            <a href="/platforms" className="cta-button primary">
              {t('testimonials.cta.explorePlatforms')}
            </a>
            <a href="/signup" className="cta-button secondary">
              {t('testimonials.cta.startTrial')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;

import React from 'react';
import '../styles/testimonials.css';

const Testimonials = () => {
  // Placeholder testimonials - will be replaced with real ones
  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      role: "Chief Medical Officer",
      organization: "Metropolitan Health System",
      platform: "RxGuard™",
      quote: "RxGuard has transformed how we approach medication safety. The AI-powered interaction detection has prevented countless adverse events in our hospital system.",
      rating: 5,
      image: null // Placeholder for future image
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      role: "Endocrinologist",
      organization: "Women's Health Clinic",
      platform: "EndoGuard™",
      quote: "EndoGuard provides insights that would take hours of manual research. My patients love the personalized hormone health recommendations and EDC exposure assessments.",
      rating: 5,
      image: null
    },
    {
      id: 3,
      name: "Jennifer Martinez, NP",
      role: "Nurse Practitioner",
      organization: "Family Medicine Practice",
      platform: "RxGuard™",
      quote: "As a busy NP, RxGuard gives me confidence that I'm not missing critical drug interactions. The interface is intuitive and the recommendations are evidence-based.",
      rating: 5,
      image: null
    }
  ];

  const stats = [
    { value: "10,000+", label: "Healthcare Professionals" },
    { value: "500,000+", label: "Patients Helped" },
    { value: "99.2%", label: "Satisfaction Rate" },
    { value: "50,000+", label: "Drug Interactions Detected" }
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
          <h1 className="testimonials-title">
            Trusted by Healthcare
            <span className="gradient-text"> Professionals Worldwide</span>
          </h1>
          <p className="testimonials-subtitle">
            Join thousands of clinicians, researchers, and healthcare organizations using our AI-powered platforms to transform patient care
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

      {/* Testimonials Grid */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Real stories from healthcare professionals making a difference</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {testimonial.image ? (
                    <img src={testimonial.image} alt={testimonial.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div className="testimonial-info">
                  <h3 className="testimonial-name">{testimonial.name}</h3>
                  <p className="testimonial-role">{testimonial.role}</p>
                  <p className="testimonial-org">{testimonial.organization}</p>
                </div>
              </div>

              <div className="testimonial-platform-badge">
                {testimonial.platform}
              </div>

              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>

              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="coming-soon-section">
        <div className="coming-soon-card">
          <div className="coming-soon-icon">🎬</div>
          <h2 className="coming-soon-title">Video Testimonials Coming Soon</h2>
          <p className="coming-soon-text">
            We're currently collecting video testimonials from our healthcare partners. Check back soon to see real clinicians share their success stories.
          </p>
          <div className="coming-soon-cta">
            <p>Want to share your experience?</p>
            <a href="mailto:support@nexusbiomedical.ai" className="cta-button">
              Submit Your Story
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="testimonials-cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Practice?</h2>
          <p className="cta-subtitle">Join thousands of healthcare professionals already using our platforms</p>
          <div className="cta-buttons">
            <a href="/platforms" className="cta-button primary">
              Explore Platforms
            </a>
            <a href="/signup" className="cta-button secondary">
              Start Free Trial
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;

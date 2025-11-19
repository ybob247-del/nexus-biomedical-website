import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    productInterest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create mailto link with form data
    const subject = `Contact Form: ${formData.productInterest || 'General Inquiry'}`;
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Product Interest: ${formData.productInterest}

Message:
${formData.message}
    `.trim();

    const mailtoLink = `mailto:support@nexusbiomedical.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;

    // Reset submitting state after a short delay (in case mailto doesn't trigger)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
    }, 500);

    // Reset form and close after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        company: '',
        productInterest: '',
        message: ''
      });
      setSubmitStatus(null);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0
              }}>
                Contact Us
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '2rem',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            </div>

            <p style={{
              color: '#64748b',
              marginBottom: '2rem',
              fontSize: 'clamp(0.95rem, 2vw, 1.05rem)'
            }}>
              Get in touch with our team. We'll respond within 24 hours.
            </p>

            {submitStatus === 'success' ? (
              <div style={{
                padding: '2rem',
                background: '#d1fae5',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                <h3 style={{ color: '#065f46', marginBottom: '0.5rem' }}>Email Client Opened!</h3>
                <p style={{ color: '#047857', margin: 0 }}>Please send the email from your email client.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Name */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 2vw, 0.875rem)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00A8CC'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 2vw, 0.875rem)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00A8CC'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Company */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 2vw, 0.875rem)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00A8CC'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Product Interest */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Product Interest
                  </label>
                  <select
                    name="productInterest"
                    value={formData.productInterest}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 2vw, 0.875rem)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box',
                      background: 'white'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00A8CC'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select a platform...</option>
                    <option value="RxGuard">RxGuard™ - Medication Safety</option>
                    <option value="ReguReady">ReguReady™ - FDA Compliance</option>
                    <option value="ClinicalIQ">ClinicalIQ™ - Evidence Synthesis</option>
                    <option value="ElderWatch">ElderWatch™ - Senior Care Monitoring</option>
                    <option value="PediCalc">PediCalc™ - Pediatric Dosing</option>
                    <option value="SkinScan">SkinScan™ - Dermatology AI</option>
                    <option value="Multiple">Multiple Platforms</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.5rem',
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                  }}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    style={{
                      width: '100%',
                      padding: 'clamp(0.75rem, 2vw, 0.875rem)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#00A8CC'}
                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: 'clamp(0.875rem, 2.5vw, 1rem)',
                    background: isSubmitting ? '#cbd5e1' : 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                    fontWeight: 700,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(0, 168, 204, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(0, 168, 204, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 168, 204, 0.3)';
                    }
                  }}
                >
                  {isSubmitting ? 'Opening Email Client...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactForm;


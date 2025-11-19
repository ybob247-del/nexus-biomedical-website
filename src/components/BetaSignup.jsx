import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const BetaSignup = ({ isOpen = true, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    platform: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'beta-signup', ...formData })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          organization: '',
          role: '',
          platform: '',
          message: ''
        })
        setTimeout(() => {
          handleClose()
          setSubmitStatus(null)
        }, 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Beta signup error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If used as standalone page (no onClose provided), use navigate
  const isStandalonePage = !onClose
  const handleClose = () => {
    if (onClose) {
      onClose()
    } else if (typeof window !== 'undefined') {
      window.history.back()
    }
  }

  if (!isOpen && !isStandalonePage) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="beta-signup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(10, 27, 61, 0.9)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000
            }}
          />

          {/* Modal */}
          <motion.div
            className="beta-signup-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '1rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              zIndex: 2001,
              margin: '0 auto'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div>
                <h2 style={{
                  color: 'var(--nexus-quantum-blue)',
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  margin: 0
                }}>
                  Request Beta Access
                </h2>
                <p style={{
                  color: '#6b7280',
                  fontSize: '0.875rem',
                  margin: '0.5rem 0 0 0'
                }}>
                  Join our exclusive beta program
                </p>
              </div>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f3f4f6'
                  e.target.style.color = 'var(--nexus-quantum-blue)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'none'
                  e.target.style.color = '#6b7280'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {submitStatus === 'success' ? (
              <div style={{
                padding: '3rem 1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3 style={{ color: 'var(--nexus-quantum-blue)', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
                  Request Submitted!
                </h3>
                <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0 }}>
                  Thank you for your interest. We'll review your application and be in touch soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="beta-name" style={{
                    color: 'var(--nexus-quantum-blue)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Full Name *
                  </label>
                  <input
                    id="beta-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Dr. Jane Smith"
                    required
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--nexus-font-family)',
                      fontSize: '1rem',
                      color: 'var(--nexus-quantum-blue)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--nexus-biomedical-teal)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 204, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="beta-email" style={{
                    color: 'var(--nexus-quantum-blue)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Email Address *
                  </label>
                  <input
                    id="beta-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane.smith@hospital.com"
                    required
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--nexus-font-family)',
                      fontSize: '1rem',
                      color: 'var(--nexus-quantum-blue)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--nexus-biomedical-teal)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 204, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="beta-organization" style={{
                    color: 'var(--nexus-quantum-blue)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Organization *
                  </label>
                  <input
                    id="beta-organization"
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Memorial Hospital"
                    required
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--nexus-font-family)',
                      fontSize: '1rem',
                      color: 'var(--nexus-quantum-blue)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--nexus-biomedical-teal)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 204, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="beta-role" style={{
                    color: 'var(--nexus-quantum-blue)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Professional Role *
                  </label>
                  <select
                    id="beta-role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--nexus-font-family)',
                      fontSize: '1rem',
                      color: 'var(--nexus-quantum-blue)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--nexus-biomedical-teal)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 204, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    <option value="">Select your role</option>
                    <option value="physician">Physician</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="nurse">Nurse Practitioner</option>
                    <option value="administrator">Healthcare Administrator</option>
                    <option value="insurance">Insurance/Payer Executive</option>
                    <option value="researcher">Clinical Researcher</option>
                    <option value="other">Other Healthcare Professional</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="beta-platform" style={{
                    color: 'var(--nexus-quantum-blue)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Platform of Interest *
                  </label>
                  <select
                    id="beta-platform"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    required
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--nexus-font-family)',
                      fontSize: '1rem',
                      color: 'var(--nexus-quantum-blue)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--nexus-biomedical-teal)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 204, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    <option value="">Select a platform</option>
                    <option value="rxguard">RxGuard™ - Medication Safety</option>
                    <option value="reguready">ReguReady™ - Regulatory Compliance</option>
                    <option value="clinicaliq">ClinicalIQ™ - Clinical Insights</option>
                    <option value="elderwatch">ElderWatch™ - Geriatric Care</option>
                    <option value="pedicalc">PediCalc Pro™ - Pediatric Dosing</option>
                    <option value="skinscan">SkinScan Pro™ - Dermatology AI</option>
                    <option value="all">All Platforms</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="beta-message" style={{
                    color: 'var(--nexus-quantum-blue)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Tell Us About Your Use Case (Optional)
                  </label>
                  <textarea
                    id="beta-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How do you plan to use Nexus Biomedical Intelligence?"
                    rows="3"
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      fontFamily: 'var(--nexus-font-family)',
                      fontSize: '1rem',
                      color: 'var(--nexus-quantum-blue)',
                      transition: 'all 0.2s ease',
                      resize: 'vertical',
                      minHeight: '80px'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--nexus-biomedical-teal)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 168, 204, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>

                {submitStatus === 'error' && (
                  <div style={{
                    background: '#fee2e2',
                    color: '#991b1b',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}>
                    Failed to submit request. Please try again or contact us directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, var(--nexus-biomedical-teal) 0%, var(--nexus-insight-purple) 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '0.5rem',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'translateY(-2px)'
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 168, 204, 0.3)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Beta Access'}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BetaSignup

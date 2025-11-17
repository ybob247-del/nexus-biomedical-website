import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    type: 'feedback',
    message: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send feedback to API endpoint
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ type: 'feedback', message: '', email: '' })
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus(null)
        }, 2000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Feedback submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="feedback-widget-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
        <span>Feedback</span>
      </motion.button>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="feedback-widget-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="feedback-widget-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="feedback-widget-header">
                <h3>We'd Love Your Feedback</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="feedback-widget-close"
                  aria-label="Close feedback form"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {submitStatus === 'success' ? (
                <div className="feedback-widget-success">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p>Thank you for your feedback!</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="feedback-widget-form">
                  <div className="feedback-widget-field">
                    <label htmlFor="feedback-type">Type</label>
                    <select
                      id="feedback-type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                    >
                      <option value="feedback">General Feedback</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="question">Question</option>
                    </select>
                  </div>

                  <div className="feedback-widget-field">
                    <label htmlFor="feedback-message">Message</label>
                    <textarea
                      id="feedback-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us what you think..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="feedback-widget-field">
                    <label htmlFor="feedback-email">Email (optional)</label>
                    <input
                      id="feedback-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                    <small>We'll only use this to follow up on your feedback</small>
                  </div>

                  {submitStatus === 'error' && (
                    <div className="feedback-widget-error">
                      Failed to submit feedback. Please try again.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="feedback-widget-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default FeedbackWidget

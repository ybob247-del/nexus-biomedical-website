import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import '../styles/screenshot-bug-widget.css'

const ScreenshotBugWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const canvasRef = useRef(null)

  const captureScreenshot = async () => {
    setIsCapturing(true)
    setIsOpen(false)
    
    try {
      // Wait a moment for the widget to close
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Capture the entire page
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      })
      
      // Convert to base64
      const screenshotData = canvas.toDataURL('image/png')
      setScreenshot(screenshotData)
      setIsOpen(true)
      setIsCapturing(false)
    } catch (error) {
      console.error('Screenshot capture failed:', error)
      setIsCapturing(false)
      setIsOpen(true)
      alert('Failed to capture screenshot. Please try again.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!description.trim()) {
      alert('Please provide a description of the issue.')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Submit to backend API
      const response = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          email: email || 'anonymous',
          screenshot,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setDescription('')
        setEmail('')
        setScreenshot(null)
        setTimeout(() => {
          setIsOpen(false)
          setSubmitStatus(null)
        }, 2000)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Bug report submission failed:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setScreenshot(null)
    setDescription('')
    setEmail('')
    setSubmitStatus(null)
  }

  return (
    <>
      {/* Floating Button */}
      <button 
        className="screenshot-bug-button"
        onClick={() => setIsOpen(true)}
        title="Report a Bug"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>

      {/* Capturing Overlay */}
      {isCapturing && (
        <div className="screenshot-capturing-overlay">
          <div className="screenshot-capturing-message">
            <div className="spinner"></div>
            <p>Capturing screenshot...</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="screenshot-bug-modal-overlay" onClick={handleClose}>
          <div className="screenshot-bug-modal" onClick={(e) => e.stopPropagation()}>
            <div className="screenshot-bug-modal-header">
              <h3>Report a Bug</h3>
              <button 
                className="screenshot-bug-close"
                onClick={handleClose}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="screenshot-bug-modal-content">
              {submitStatus === 'success' ? (
                <div className="screenshot-bug-success">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <h4>Thank you!</h4>
                  <p>Your bug report has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {!screenshot ? (
                    <div className="screenshot-bug-capture-section">
                      <p className="screenshot-bug-instructions">
                        Click the button below to capture a screenshot of the current page, 
                        then describe the issue you encountered.
                      </p>
                      <button 
                        type="button"
                        className="screenshot-bug-capture-btn"
                        onClick={captureScreenshot}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        Capture Screenshot
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="screenshot-bug-preview">
                        <img src={screenshot} alt="Screenshot preview" />
                        <button 
                          type="button"
                          className="screenshot-bug-retake"
                          onClick={captureScreenshot}
                        >
                          Retake Screenshot
                        </button>
                      </div>

                      <div className="screenshot-bug-form-group">
                        <label htmlFor="bug-description">
                          Description <span className="required">*</span>
                        </label>
                        <textarea
                          id="bug-description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Please describe the issue you encountered..."
                          rows="4"
                          required
                        />
                      </div>

                      <div className="screenshot-bug-form-group">
                        <label htmlFor="bug-email">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          id="bug-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                        />
                        <small>We'll use this to follow up if needed</small>
                      </div>

                      {submitStatus === 'error' && (
                        <div className="screenshot-bug-error">
                          Failed to submit bug report. Please try again or contact support.
                        </div>
                      )}

                      <div className="screenshot-bug-form-actions">
                        <button 
                          type="button" 
                          className="screenshot-bug-btn-secondary"
                          onClick={handleClose}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="screenshot-bug-btn-primary"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ScreenshotBugWidget

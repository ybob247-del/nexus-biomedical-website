import { useState, useRef } from 'react'
import '../styles/screenshot-bug-widget.css'

function ScreenshotBugWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [screenshot, setScreenshot] = useState(null)
  const [description, setDescription] = useState('')
  const [email, setEmail] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const fileInputRef = useRef(null)

  const captureScreenshot = async () => {
    setIsCapturing(true)
    setIsOpen(false)
    
    try {
      // Use native browser screenshot API
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        preferCurrentTab: true
      })
      
      // Create video element to capture frame
      const video = document.createElement('video')
      video.srcObject = stream
      video.play()
      
      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve
      })
      
      // Create canvas and capture frame
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop())
      
      // Convert to base64
      const screenshotData = canvas.toDataURL('image/png')
      setScreenshot(screenshotData)
      setIsOpen(true)
      setIsCapturing(false)
    } catch (error) {
      console.error('Screenshot capture failed:', error)
      setIsCapturing(false)
      setIsOpen(true)
      
      // Show user-friendly message based on error
      if (error.name === 'NotAllowedError') {
        alert('Screenshot permission denied. You can upload a screenshot manually or skip it.')
      } else {
        alert('Screenshot capture failed. You can upload a screenshot manually or skip it.')
      }
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setScreenshot(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/bug-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screenshot,
          description,
          email,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit bug report')
      }

      setSubmitStatus('success')
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error) {
      console.error('Error submitting bug report:', error)
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
      <button 
        className="screenshot-bug-button"
        onClick={() => setIsOpen(true)}
        aria-label="Report a bug"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="screenshot-bug-button-text">Report Bug</span>
      </button>

      {isCapturing && (
        <div className="screenshot-capturing-overlay">
          <div className="screenshot-capturing-message">
            <div className="spinner"></div>
            <p>Capturing screenshot...</p>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="screenshot-bug-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) handleClose()
        }}>
          <div className="screenshot-bug-modal">
            <div className="screenshot-bug-modal-header">
              <h3>Report a Bug</h3>
              <button 
                className="screenshot-bug-close"
                onClick={handleClose}
                aria-label="Close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="screenshot-bug-modal-content">
              {submitStatus === 'success' ? (
                <div className="screenshot-bug-success">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4>Thank You!</h4>
                  <p>Your bug report has been submitted successfully.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {!screenshot ? (
                    <div className="screenshot-bug-capture-section">
                      <p className="screenshot-bug-instructions">
                        Capture a screenshot to help us understand the issue better, or upload one manually.
                      </p>
                      <div className="screenshot-bug-button-group">
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
                        <button 
                          type="button"
                          className="screenshot-bug-skip-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                          </svg>
                          Upload Screenshot
                        </button>
                        <button 
                          type="button"
                          className="screenshot-bug-skip-btn"
                          onClick={() => setScreenshot('skipped')}
                        >
                          Skip Screenshot
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                  ) : (
                    <>
                      {screenshot !== 'skipped' && (
                        <div className="screenshot-bug-preview">
                          <img src={screenshot} alt="Screenshot preview" />
                          <button 
                            type="button"
                            className="screenshot-bug-retake"
                            onClick={() => setScreenshot(null)}
                          >
                            Change Screenshot
                          </button>
                        </div>
                      )}

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

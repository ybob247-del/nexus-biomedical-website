import React from 'react'

const BetaDisclaimer = ({ platformColor = '#00A8CC' }) => {
  return (
    <div style={{
      background: 'rgba(255, 193, 7, 0.1)',
      border: '2px solid #FFC107',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '2rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    }}>
      <div style={{
        fontSize: '2rem',
        lineHeight: 1,
        flexShrink: 0
      }}>
        ⚠️
      </div>
      <div>
        <h3 style={{
          color: '#FFC107',
          fontSize: '1.25rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
          margin: 0
        }}>
          Welcome to Our Beta Testing Platform
        </h3>
        <p style={{
          color: '#FFFFFF',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          margin: 0,
          opacity: 0.95
        }}>
          Thank you for helping us test and improve our platform! This is a beta environment designed for evaluation and feedback. <strong>Please use only test or sample data</strong> — no real patient information (PHI, PII, or ePHI) should be entered at this time. We're working hard to prepare for full certification, and your input is invaluable in making this platform safer and better for everyone.
        </p>
      </div>
    </div>
  )
}

export default BetaDisclaimer

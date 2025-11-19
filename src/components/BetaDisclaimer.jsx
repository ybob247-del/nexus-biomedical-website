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
          BETA TEST ENVIRONMENT - DO NOT ENTER REAL PATIENT DATA
        </h3>
        <p style={{
          color: '#FFFFFF',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          margin: 0,
          opacity: 0.95
        }}>
          This is a beta testing platform for evaluation purposes only. <strong>Do not enter any real Protected Health Information (PHI), Personally Identifiable Information (PII), or electronic Protected Health Information (ePHI).</strong> Use only test, dummy, or sample data. By using this demo, you acknowledge that this platform is not yet certified for production use with real patient data.
        </p>
      </div>
    </div>
  )
}

export default BetaDisclaimer

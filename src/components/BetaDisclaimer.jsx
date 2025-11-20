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
          Important: Demo Environment
        </h3>
        <p style={{
          color: '#FFFFFF',
          fontSize: '0.95rem',
          lineHeight: 1.6,
          margin: 0,
          opacity: 0.95
        }}>
          Welcome! You're exploring our interactive demo environment. To protect your privacy and security, <strong>please use only test or sample data</strong> when trying out features. Do not enter real patient information, personal health data, or any sensitive information. This demo showcases our platform's capabilities — contact us to discuss production deployment for your organization.
        </p>
      </div>
    </div>
  )
}

export default BetaDisclaimer

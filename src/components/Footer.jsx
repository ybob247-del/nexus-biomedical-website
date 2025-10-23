import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--nexus-quantum-blue)',
      color: 'white',
      padding: '3rem 2rem',
      textAlign: 'center'
    }}>
      <div className="container">
        <h3 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem'
        }}>
          Nexus Biomedical Intelligence
        </h3>
        <p style={{
          fontSize: '1.125rem',
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Transforming Healthcare Through AI Innovation
        </p>
        <div style={{
          display: 'flex',
          gap: '2rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>About Us</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Contact</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Careers</a>
          <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Privacy Policy</a>
        </div>
        <p style={{
          fontSize: '0.875rem',
          opacity: 0.7
        }}>
          © 2025 Nexus Biomedical Intelligence LLC. All rights reserved.
        </p>
      </div>
    </footer>
  )
}


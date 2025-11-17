import React from 'react'
import { Link } from 'react-router-dom'

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
          <Link to="/privacy" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Terms of Service</Link>
          <Link to="/hipaa" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>HIPAA Compliance</Link>
          <a href="mailto:contact@nexusbiomedical.ai" style={{ color: 'white', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.8}>Contact</a>
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


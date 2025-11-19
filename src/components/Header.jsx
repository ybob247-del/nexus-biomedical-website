import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/header.css'
import nexusLogoOfficial from '../assets/logos/nexus-logo-official.png'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (sectionId) => {
    // If not on homepage, navigate to homepage first
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        element?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      element?.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBetaClick = () => {
    navigate('/beta-signup')
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="nexus-header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand" onClick={handleLogoClick}>
          <div className="header-logo">
            <img 
              src={nexusLogoOfficial} 
              alt="Nexus Biomedical Intelligence" 
              className="logo-image"
              style={{
                height: '60px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
          </div>
          <div className="header-brand-text">
            <span className="brand-name">Nexus Biomedical Intelligence</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <button onClick={() => handleNavClick('platforms')} className="nav-link">
            Platforms
          </button>
          <button onClick={() => navigate('/about')} className="nav-link">
            About
          </button>
          <button onClick={() => handleNavClick('faq')} className="nav-link">
            FAQ
          </button>
          <button 
            onClick={handleBetaClick} 
            className="nav-link nav-cta"
          >
            Request Beta Access
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMobileMenuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`header-nav mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <button onClick={() => handleNavClick('platforms')} className="nav-link">
          Platforms
        </button>
        <button onClick={() => navigate('/about')} className="nav-link">
          About
        </button>
        <button onClick={() => handleNavClick('faq')} className="nav-link">
          FAQ
        </button>
        <button 
          onClick={handleBetaClick} 
          className="nav-link nav-cta"
        >
          Request Beta Access
        </button>
      </nav>
    </header>
  )
}

export default Header

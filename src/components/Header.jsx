import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/header.css'

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

  return (
    <header className="nexus-header">
      <div className="header-container">
        {/* Logo and Brand */}
        <div className="header-brand" onClick={handleLogoClick}>
          <div className="header-logo">
            <svg 
              className="logo-icon" 
              viewBox="0 0 100 100" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Animated X Logo */}
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D9FF" />
                  <stop offset="50%" stopColor="#00A8CC" />
                  <stop offset="100%" stopColor="#0088AA" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* X Shape */}
              <path 
                className="logo-path logo-path-1"
                d="M 20 20 L 80 80" 
                stroke="url(#logoGradient)" 
                strokeWidth="8" 
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
              />
              <path 
                className="logo-path logo-path-2"
                d="M 80 20 L 20 80" 
                stroke="url(#logoGradient)" 
                strokeWidth="8" 
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
              />
              
              {/* Center Dot */}
              <circle 
                className="logo-center"
                cx="50" 
                cy="50" 
                r="6" 
                fill="#00D9FF"
                filter="url(#glow)"
              />
            </svg>
          </div>
          <span className="header-brand-text">Nexus Biomedical Intelligence</span>
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
            onClick={() => window.open('https://calendly.com/nexusbiomedical-ai/30min', '_blank')} 
            className="nav-link nav-cta"
          >
            Schedule Demo
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
          onClick={() => {
            window.open('https://calendly.com/nexusbiomedical-ai/30min', '_blank')
            setIsMobileMenuOpen(false)
          }} 
          className="nav-link nav-cta"
        >
          Schedule Demo
        </button>
      </nav>
    </header>
  )
}

export default Header

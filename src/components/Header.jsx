import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/header.css'
import nexusLogoOfficial from '../assets/logos/nexus-logo-official.png'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPlatformsDropdownOpen, setIsPlatformsDropdownOpen] = useState(false)
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
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
              className="logo-image logo-animated"
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
          <div 
            className="desktop-dropdown-container"
            onMouseEnter={() => setIsDesktopDropdownOpen(true)}
            onMouseLeave={() => setIsDesktopDropdownOpen(false)}
          >
            <button onClick={() => handleNavClick('platforms')} className="nav-link nav-dropdown-toggle">
              Platforms
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 16 16" 
                fill="currentColor"
                style={{ 
                  marginLeft: '6px', 
                  transform: isDesktopDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </button>
            {isDesktopDropdownOpen && (
              <div className="desktop-dropdown">
                <button onClick={() => navigate('/rxguard')} className="desktop-dropdown-link">RxGuard™</button>
                <button onClick={() => navigate('/reguready')} className="desktop-dropdown-link">ReguReady™</button>
                <button onClick={() => navigate('/clinicaliq')} className="desktop-dropdown-link">ClinicalIQ™</button>
                <button onClick={() => navigate('/elderwatch')} className="desktop-dropdown-link">ElderWatch™</button>
                <button onClick={() => navigate('/pedicalc-pro')} className="desktop-dropdown-link">PediCalc Pro™</button>
                <button onClick={() => navigate('/skinscan-pro')} className="desktop-dropdown-link">SkinScan Pro™</button>
                <button onClick={() => navigate('/endoguard')} className="desktop-dropdown-link">EndoGuard™</button>
              </div>
            )}
          </div>
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
        <div className="mobile-nav-item">
          <button 
            onClick={() => setIsPlatformsDropdownOpen(!isPlatformsDropdownOpen)} 
            className="nav-link nav-dropdown-toggle"
          >
            Platforms
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="currentColor"
              style={{ 
                marginLeft: '8px', 
                transform: isPlatformsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
          {isPlatformsDropdownOpen && (
            <div className="mobile-dropdown">
              <button onClick={() => { navigate('/rxguard'); setIsMobileMenuOpen(false); }} className="dropdown-link">RxGuard™</button>
              <button onClick={() => { navigate('/reguready'); setIsMobileMenuOpen(false); }} className="dropdown-link">ReguReady™</button>
              <button onClick={() => { navigate('/clinicaliq'); setIsMobileMenuOpen(false); }} className="dropdown-link">ClinicalIQ™</button>
              <button onClick={() => { navigate('/elderwatch'); setIsMobileMenuOpen(false); }} className="dropdown-link">ElderWatch™</button>
              <button onClick={() => { navigate('/pedicalc-pro'); setIsMobileMenuOpen(false); }} className="dropdown-link">PediCalc Pro™</button>
              <button onClick={() => { navigate('/skinscan-pro'); setIsMobileMenuOpen(false); }} className="dropdown-link">SkinScan Pro™</button>
              <button onClick={() => { navigate('/endoguard'); setIsMobileMenuOpen(false); }} className="dropdown-link">EndoGuard™</button>
            </div>
          )}
        </div>
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

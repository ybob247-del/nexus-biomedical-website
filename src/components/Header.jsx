import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import '../styles/header.css'
import nexusLogoOfficial from '../assets/logos/nexus-logo-official.png'
import LanguageToggle from './LanguageToggle'

const Header = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isPlatformsDropdownOpen, setIsPlatformsDropdownOpen] = useState(false)
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
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

  const handleGetStartedClick = () => {
    if (user) {
      navigate('/platforms');
    } else {
      navigate('/login');
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

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
            <button className="nav-link nav-dropdown-toggle">
              {t('nav.platforms')}
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
                <button onClick={() => navigate('/pedicalc')} className="desktop-dropdown-link">PediCalc Pro™</button>
                <button onClick={() => navigate('/skinscan')} className="desktop-dropdown-link">SkinScan Pro™</button>
                <button onClick={() => navigate('/endoguard')} className="desktop-dropdown-link">EndoGuard™</button>
              </div>
            )}
          </div>
          <button onClick={() => navigate('/about')} className="nav-link">
            {t('nav.about')}
          </button>
          <button onClick={() => handleNavClick('faq')} className="nav-link">
            FAQ
          </button>
          {user ? (
            <div 
              className="desktop-dropdown-container"
              onMouseEnter={() => setIsUserMenuOpen(true)}
              onMouseLeave={() => setIsUserMenuOpen(false)}
            >
              <button className="nav-link nav-dropdown-toggle">
                {user.email}
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 16 16" 
                  fill="currentColor"
                  style={{ 
                    marginLeft: '6px', 
                    transform: isUserMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="desktop-dropdown">
                  <button onClick={() => navigate('/account/subscription')} className="desktop-dropdown-link">My Subscriptions</button>
                  <button onClick={() => navigate('/dashboard')} className="desktop-dropdown-link">Dashboard</button>
                  <button onClick={handleLogout} className="desktop-dropdown-link">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleGetStartedClick} 
              className="nav-link nav-cta"
            >
              Login
            </button>
          )}
          <LanguageToggle />
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
            {t('nav.platforms')}
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
              <button onClick={() => { navigate('/pedicalc'); setIsMobileMenuOpen(false); }} className="dropdown-link">PediCalc Pro™</button>
              <button onClick={() => { navigate('/skinscan'); setIsMobileMenuOpen(false); }} className="dropdown-link">SkinScan Pro™</button>
              <button onClick={() => { navigate('/endoguard'); setIsMobileMenuOpen(false); }} className="dropdown-link">EndoGuard™</button>
            </div>
          )}
        </div>
        <button onClick={() => navigate('/about')} className="nav-link">
          {t('nav.about')}
        </button>
        <button onClick={() => handleNavClick('faq')} className="nav-link">
          FAQ
        </button>
        {user ? (
          <>
            <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="nav-link">
              Dashboard
            </button>
            <button onClick={() => { navigate('/account/subscription'); setIsMobileMenuOpen(false); }} className="nav-link">
              My Subscriptions
            </button>
            <button onClick={handleLogout} className="nav-link nav-cta">
              Logout
            </button>
          </>
        ) : (
          <button 
            onClick={handleGetStartedClick} 
            className="nav-link nav-cta"
          >
            {t('auth.getStarted')}
          </button>
        )}
        <div style={{ padding: '1rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '1rem' }}>
          <LanguageToggle />
        </div>
      </nav>
    </header>
  )
}

export default Header

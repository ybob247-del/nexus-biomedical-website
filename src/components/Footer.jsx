import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/footer.css'

export default function Footer() {
  const navigate = useNavigate()

  const handlePlatformClick = (platformUrl) => {
    navigate(`/${platformUrl}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="nexus-footer">
      <div className="footer-container">
        {/* Company Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">Company</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => navigate('/')} className="footer-link">
                About
              </button>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
                Careers<br />(Coming Soon)
              </span>
            </li>
            <li>
              <a href="mailto:support@nexusbiomedical.ai" className="footer-link">
                Contact
              </a>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
                Blog<br />(Coming Soon)
              </span>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">Resources</h4>
          <ul className="footer-links">
            <li>
              <span className="footer-link footer-link-disabled">
                Documentation<br />(Coming Soon)
              </span>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
                Research<br />(Coming Soon)
              </span>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
                Case Studies<br />(Coming Soon)
              </span>
            </li>
            <li>
              <a href="mailto:support@nexusbiomedical.ai" className="footer-link">
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Platforms Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">Platforms</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => handlePlatformClick('rxguard')} className="footer-link">
                RxGuard™
              </button>
            </li>
            <li>
              <button onClick={() => handlePlatformClick('reguready')} className="footer-link">
                ReguReady™
              </button>
            </li>
            <li>
              <button onClick={() => handlePlatformClick('clinicaliq')} className="footer-link">
                ClinicalIQ™
              </button>
            </li>
            <li>
              <button onClick={() => handlePlatformClick('elderwatch')} className="footer-link">
                ElderWatch™
              </button>
            </li>
            <li>
              <button onClick={() => handlePlatformClick('pedicalc')} className="footer-link">
                PediCalc Pro™
              </button>
            </li>
            <li>
              <button onClick={() => handlePlatformClick('skinscan')} className="footer-link">
                SkinScan Pro™
              </button>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">Legal</h4>
          <ul className="footer-links">
            <li>
              <Link to="/privacy" className="footer-link">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="footer-link">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/hipaa" className="footer-link">
                HIPAA Compliance
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <h3 className="footer-brand">Nexus Biomedical Intelligence</h3>
          <p className="footer-tagline">Transforming Healthcare Through AI Innovation</p>
          <p className="footer-copyright">
            © 2025 Nexus Biomedical Intelligence LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/footer.css'

export default function Footer() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handlePlatformClick = (platformUrl) => {
    navigate(`/${platformUrl}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLegalClick = (path) => {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="nexus-footer">
      <div className="footer-container">
        {/* Company Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">{t('footer.company')}</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => navigate('/about')} className="footer-link">
                {t('footer.aboutUs')}
              </button>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
{t('footer.careers')}<br />({t('platforms.comingSoon')})
              </span>
            </li>
            <li>
              <a href="mailto:support@nexusbiomedical.ai" className="footer-link">
                {t('footer.contact')}
              </a>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
{t('footer.blog')}<br />({t('platforms.comingSoon')})
              </span>
            </li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">{t('footer.resources')}</h4>
          <ul className="footer-links">
            <li>
              <span className="footer-link footer-link-disabled">
{t('footer.documentation')}<br />({t('platforms.comingSoon')})
              </span>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
Research<br />({t('platforms.comingSoon')})
              </span>
            </li>
            <li>
              <span className="footer-link footer-link-disabled">
{t('footer.caseStudies')}<br />({t('platforms.comingSoon')})
              </span>
            </li>
            <li>
              <a href="mailto:support@nexusbiomedical.ai" className="footer-link">
                {t('footer.support')}
              </a>
            </li>
          </ul>
        </div>

        {/* Platforms Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">{t('nav.platforms')}</h4>
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
            <li>
              <button onClick={() => handlePlatformClick('endoguard')} className="footer-link">
                EndoGuard™
              </button>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">{t('footer.legal')}</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => handleLegalClick('/privacy')} className="footer-link">
                {t('footer.privacy')}
              </button>
            </li>
            <li>
              <button onClick={() => handleLegalClick('/terms')} className="footer-link">
                {t('footer.terms')}
              </button>
            </li>
            <li>
              <button onClick={() => handleLegalClick('/hipaa')} className="footer-link">
                {t('footer.security')}
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <h3 className="footer-brand">Nexus Biomedical Intelligence</h3>
          <p className="footer-tagline">{t('footer.tagline')}</p>
          <p className="footer-copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}

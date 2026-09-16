import React from 'react'
import brand from '../config/brand';
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

  // The consumer brand sells one product, so it gets a short footer: the legal
  // pages a buyer (and Stripe) looks for, a real contact, and who runs it.
  if (brand.isConsumerBrand) {
    return (
      <footer className="nii-footer">
        <div className="nii-footer-inner">
          <div>
            <p className="nii-footer-brand">{brand.name}</p>
            <p className="nii-footer-tagline">{brand.tagline}</p>
          </div>
          <nav className="nii-footer-links" aria-label="Legal and contact">
            <button onClick={() => handleLegalClick('/refund-policy')}>Refund Policy</button>
            <button onClick={() => handleLegalClick('/privacy')}>Privacy Policy</button>
            <button onClick={() => handleLegalClick('/terms')}>Terms of Service</button>
            <button onClick={() => handleLegalClick('/medical-disclaimer')}>Medical Disclaimer</button>
            <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>
          </nav>
        </div>
        <p className="nii-footer-fine">
          Educational only. Not medical advice, and not a diagnosis. © {new Date().getFullYear()}{' '}
          {brand.legalName}. {brand.name} is a brand of {brand.legalName}.
        </p>
      </footer>
    )
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
              <button onClick={() => navigate('/blog')} className="footer-link">
                {t('footer.blog')}
              </button>
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
              <a href={`mailto:${brand.supportEmail}`} className="footer-link">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Platforms Column */}
        <div className="footer-column">
          <h4 className="footer-column-title">{t('nav.platforms')}</h4>
          <ul className="footer-links">
            <li>
              <button onClick={() => handlePlatformClick('endoguard')} className="footer-link">
                {brand.productName}
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
            <li>
              <button onClick={() => handleLegalClick('/medical-disclaimer')} className="footer-link">
                Medical Disclaimer
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <h3 className="footer-brand">{brand.name}</h3>
          <p className="footer-tagline">{t('footer.tagline')}</p>
          <p className="footer-copyright">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  )
}

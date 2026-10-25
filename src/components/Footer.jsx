import React from 'react'
import brand from '../config/brand';
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../styles/footer.css'
import { TRACKER_URL } from './brand/FreeTrackerLink'

const NII_SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/not_imagining_it/',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.9 5.9 0 0 0-2.13 1.38A5.9 5.9 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91a5.9 5.9 0 0 0 1.38 2.13 5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@notimaginingit',
    path: 'M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06v-3.1a5.66 5.66 0 0 0-.77-.05A5.68 5.68 0 1 0 15.54 15.4V9.01a7.35 7.35 0 0 0 4.3 1.38v-3.1a4.28 4.28 0 0 1-3.24-1.47Z',
  },
  {
    name: 'Pinterest',
    href: 'https://www.pinterest.com/notimaginingit/',
    path: 'M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.19-2.38.04-3.4.21-.92 1.37-5.85 1.37-5.85s-.35-.7-.35-1.73c0-1.62.94-2.83 2.11-2.83 1 0 1.48.75 1.48 1.64 0 1-.64 2.5-.97 3.89-.27 1.16.58 2.1 1.73 2.1 2.08 0 3.67-2.19 3.67-5.35 0-2.8-2-4.75-4.88-4.75-3.32 0-5.27 2.49-5.27 5.07 0 1 .39 2.08.87 2.66.1.12.11.22.08.34l-.33 1.33c-.05.21-.17.26-.39.16-1.46-.68-2.37-2.81-2.37-4.52 0-3.68 2.67-7.06 7.71-7.06 4.05 0 7.19 2.88 7.19 6.74 0 4.02-2.53 7.25-6.05 7.25-1.18 0-2.29-.61-2.67-1.34l-.73 2.78c-.26 1.01-.97 2.28-1.45 3.05A12 12 0 1 0 12 0Z',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@NotImaginingIt',
    path: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z',
  },
]

export default function Footer() {
  const { t, i18n } = useTranslation()
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
  // pages a buyer (and Stripe) looks for, a real contact, and who runs it —
  // plus the accounts we actually post to, so a reader who wants more has
  // somewhere to go.
  if (brand.isConsumerBrand) {
    const es = i18n.language?.startsWith('es')
    const year = new Date().getFullYear()
    return (
      <footer className="nii-footer">
        <div className="nii-footer-inner">
          <div>
            <p className="nii-footer-brand">{brand.name}</p>
            <p className="nii-footer-tagline">{es ? 'Sistemas, no solo síntomas.' : brand.tagline}</p>
          </div>
          <nav className="nii-footer-links" aria-label={es ? 'Información legal y contacto' : 'Legal and contact'}>
            <button onClick={() => handleLegalClick('/sample')}>{es ? 'Ver un kit de ejemplo' : 'See a sample kit'}</button>
            <a href={es ? TRACKER_URL.es : TRACKER_URL.en}>{es ? 'Registro gratis' : 'Free tracker'}</a>
            <button onClick={() => handleLegalClick('/how-it-works')}>{es ? 'Cómo se crea' : 'How it works'}</button>
            <button onClick={() => handleLegalClick('/about')}>{es ? 'Sobre nosotras' : 'About'}</button>
            <button onClick={() => handleLegalClick('/refund-policy')}>{es ? 'Política de reembolso' : 'Refund Policy'}</button>
            <button onClick={() => handleLegalClick('/privacy')}>{es ? 'Política de privacidad' : 'Privacy Policy'}</button>
            <button onClick={() => handleLegalClick('/terms')}>{es ? 'Términos del servicio' : 'Terms of Service'}</button>
            <button onClick={() => handleLegalClick('/medical-disclaimer')}>{es ? 'Aviso médico' : 'Medical Disclaimer'}</button>
            <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>
          </nav>
          <div className="nii-footer-social" aria-label={es ? 'Redes sociales' : 'Social media'}>
            {NII_SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${brand.name}${es ? ' en ' : ' on '}${s.name}`}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
        <p className="nii-footer-fine">
          {es
            ? `Solo con fines educativos. No es consejo médico ni un diagnóstico. © ${year} ${brand.legalName}. ${brand.name} es una marca de ${brand.legalName}.`
            : `Educational only. Not medical advice, and not a diagnosis. © ${year} ${brand.legalName}. ${brand.name} is a brand of ${brand.legalName}.`}
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

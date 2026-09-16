import { useTranslation } from 'react-i18next';
import { setLanguagePreference } from '../utils/languagePreference';

/**
 * English / Español switch for the consumer brand.
 *
 * The Nexus LanguageToggle moves the visitor to an /es/ URL, and those routes
 * are Nexus pages. The consumer site keeps one set of URLs and only swaps the
 * language in place, remembering the choice for the next visit.
 */
export default function ConsumerLanguageToggle({ className = '' }) {
  const { i18n } = useTranslation();
  const current = i18n.language?.startsWith('es') ? 'es' : 'en';

  const choose = (lang) => {
    if (lang === current) return;
    // Save first: App re-reads the saved preference whenever the language changes.
    setLanguagePreference(lang);
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute('lang', lang);
  };

  return (
    <div className={`nii-lang-toggle ${className}`} role="group" aria-label="Language / Idioma">
      <button
        type="button"
        lang="en"
        aria-pressed={current === 'en'}
        onClick={() => choose('en')}
      >
        English
      </button>
      <button
        type="button"
        lang="es"
        aria-pressed={current === 'es'}
        onClick={() => choose('es')}
      >
        Español
      </button>
    </div>
  );
}

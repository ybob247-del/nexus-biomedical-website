import seoMetaTags from '../config/seo-meta-tags.json';

/**
 * Update page meta tags based on current language and page
 * @param {string} page - Page identifier (home, about, platforms, pricing)
 * @param {string} language - Current language (en, es)
 */
export function updateMetaTags(page = 'home', language = 'en') {
  const meta = seoMetaTags[language]?.[page] || seoMetaTags.en[page];
  
  if (!meta) {
    console.warn(`No SEO meta tags found for page: ${page}, language: ${language}`);
    return;
  }

  // Update title
  if (meta.title) {
    document.title = meta.title;
  }

  // Update description
  updateMetaTag('name', 'description', meta.description);
  
  // Update keywords
  if (meta.keywords) {
    updateMetaTag('name', 'keywords', meta.keywords);
  }

  // Update Open Graph tags
  if (meta.ogTitle) {
    updateMetaTag('property', 'og:title', meta.ogTitle);
  }
  if (meta.ogDescription) {
    updateMetaTag('property', 'og:description', meta.ogDescription);
  }

  // Update Twitter tags
  if (meta.twitterTitle) {
    updateMetaTag('property', 'twitter:title', meta.twitterTitle);
  }
  if (meta.twitterDescription) {
    updateMetaTag('property', 'twitter:description', meta.twitterDescription);
  }

  // Update html lang attribute
  document.documentElement.lang = language;
  
  // Update html dir attribute for RTL support (future: Arabic)
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Helper function to update or create a meta tag
 * @param {string} attr - Attribute name (name or property)
 * @param {string} key - Attribute value
 * @param {string} content - Content value
 */
function updateMetaTag(attr, key, content) {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

/**
 * Update canonical URL with language parameter
 * @param {string} language - Current language (en, es)
 */
export function updateCanonicalUrl(language = 'en') {
  const baseUrl = window.location.origin + window.location.pathname;
  const canonicalUrl = language === 'en' ? baseUrl : `${baseUrl}?lang=${language}`;
  
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.href = canonicalUrl;
  } else {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = canonicalUrl;
    document.head.appendChild(canonical);
  }
}

/**
 * Generate structured data (JSON-LD) for Spanish language
 * @param {string} language - Current language (en, es)
 */
export function updateStructuredData(language = 'en') {
  if (language !== 'es') return; // Only add Spanish structured data
  
  const spanishStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nexus Biomedical Intelligence",
    "url": "https://nexusbiomedical.ai",
    "description": "Una suite de siete plataformas de IA en salud para cumplimiento regulatorio, seguridad de medicamentos, investigación clínica y salud digital.",
    "inLanguage": "es",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nexusbiomedical.ai/search?q={search_term_string}&lang=es",
      "query-input": "required name=search_term_string"
    }
  };

  // Check if Spanish structured data already exists
  const existingScript = document.querySelector('script[type="application/ld+json"][data-lang="es"]');
  if (!existingScript) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-lang', 'es');
    script.textContent = JSON.stringify(spanishStructuredData);
    document.head.appendChild(script);
  }
}

/**
 * Initialize SEO for current page and language
 * @param {string} page - Page identifier
 * @param {string} language - Current language
 */
export function initializeSEO(page = 'home', language = 'en') {
  updateMetaTags(page, language);
  updateCanonicalUrl(language);
  updateStructuredData(language);
}

/**
 * SEO Utility for Bilingual Meta Tag Management
 * Handles meta tags, canonical URLs, and structured data for English and Spanish
 */

// SEO meta tags configuration for different pages and languages
const seoMetaTags = {
  en: {
    home: {
      title: 'Nexus Biomedical Intelligence | AI-Powered Healthcare Platforms',
      description: 'Seven revolutionary AI healthcare platforms transforming patient safety, clinical decisions, regulatory compliance, and medical innovation across the healthcare ecosystem.',
      keywords: 'AI healthcare, clinical decision support, drug interaction checker, FDA regulatory compliance, clinical trials, medical AI platforms',
      ogTitle: 'Nexus Biomedical Intelligence - AI Healthcare Innovation',
      ogDescription: 'Transform healthcare with AI-powered platforms for medication safety, regulatory compliance, and clinical excellence.',
      twitterTitle: 'Nexus Biomedical Intelligence',
      twitterDescription: 'AI-powered healthcare platforms for safer, smarter medical decisions'
    },
    about: {
      title: 'About Us | Nexus Biomedical Intelligence',
      description: 'Learn about Nexus Biomedical Intelligence and our mission to transform healthcare through AI-powered clinical decision support and regulatory compliance platforms.',
      keywords: 'healthcare AI company, medical technology, clinical decision support, healthcare innovation',
      ogTitle: 'About Nexus Biomedical Intelligence',
      ogDescription: 'Transforming healthcare through AI innovation and clinical excellence',
      twitterTitle: 'About Nexus Biomedical Intelligence',
      twitterDescription: 'Our mission to revolutionize healthcare with AI'
    },
    platforms: {
      title: 'AI Healthcare Platforms | Nexus Biomedical Intelligence',
      description: 'Explore our suite of AI-powered healthcare platforms: RxGuard, EndoGuard, ElderWatch, PediCalc Pro, ClinicalIQ, ReguReady, and SkinScan Pro.',
      keywords: 'healthcare platforms, AI medical software, clinical tools, medication safety, regulatory compliance',
      ogTitle: 'AI Healthcare Platforms - Nexus Biomedical',
      ogDescription: 'Seven specialized AI platforms for every healthcare need',
      twitterTitle: 'Nexus Healthcare Platforms',
      twitterDescription: 'AI-powered solutions for modern healthcare challenges'
    },
    pricing: {
      title: 'Pricing | Nexus Biomedical Intelligence',
      description: 'Flexible pricing plans for healthcare providers, organizations, and enterprises. Start with a free trial of our AI-powered healthcare platforms.',
      keywords: 'healthcare software pricing, medical AI cost, clinical platform subscription',
      ogTitle: 'Nexus Biomedical Pricing Plans',
      ogDescription: 'Affordable AI healthcare solutions for every organization size',
      twitterTitle: 'Nexus Pricing',
      twitterDescription: 'Flexible plans for AI-powered healthcare'
    }
  },
  es: {
    home: {
      title: 'Nexus Biomedical Intelligence | Plataformas de Salud con IA',
      description: 'Siete plataformas revolucionarias de IA en salud que transforman la seguridad del paciente, decisiones clínicas, cumplimiento regulatorio e innovación médica en todo el ecosistema de atención médica.',
      keywords: 'IA en salud, apoyo a decisiones clínicas, verificador de interacciones de medicamentos, cumplimiento regulatorio FDA, ensayos clínicos, plataformas médicas de IA',
      ogTitle: 'Nexus Biomedical Intelligence - Innovación en Salud con IA',
      ogDescription: 'Transforme la atención médica con plataformas impulsadas por IA para seguridad de medicamentos, cumplimiento regulatorio y excelencia clínica.',
      twitterTitle: 'Nexus Biomedical Intelligence',
      twitterDescription: 'Plataformas de salud impulsadas por IA para decisiones médicas más seguras e inteligentes'
    },
    about: {
      title: 'Acerca de Nosotros | Nexus Biomedical Intelligence',
      description: 'Conozca Nexus Biomedical Intelligence y nuestra misión de transformar la atención médica a través de plataformas de apoyo a decisiones clínicas y cumplimiento regulatorio impulsadas por IA.',
      keywords: 'empresa de IA en salud, tecnología médica, apoyo a decisiones clínicas, innovación en salud',
      ogTitle: 'Acerca de Nexus Biomedical Intelligence',
      ogDescription: 'Transformando la atención médica a través de la innovación en IA y excelencia clínica',
      twitterTitle: 'Acerca de Nexus Biomedical Intelligence',
      twitterDescription: 'Nuestra misión de revolucionar la atención médica con IA'
    },
    platforms: {
      title: 'Plataformas de Salud con IA | Nexus Biomedical Intelligence',
      description: 'Explore nuestra suite de plataformas de salud impulsadas por IA: RxGuard, EndoGuard, ElderWatch, PediCalc Pro, ClinicalIQ, ReguReady y SkinScan Pro.',
      keywords: 'plataformas de salud, software médico con IA, herramientas clínicas, seguridad de medicamentos, cumplimiento regulatorio',
      ogTitle: 'Plataformas de Salud con IA - Nexus Biomedical',
      ogDescription: 'Siete plataformas especializadas de IA para cada necesidad de atención médica',
      twitterTitle: 'Plataformas de Salud Nexus',
      twitterDescription: 'Soluciones impulsadas por IA para desafíos modernos de atención médica'
    },
    pricing: {
      title: 'Precios | Nexus Biomedical Intelligence',
      description: 'Planes de precios flexibles para proveedores de atención médica, organizaciones y empresas. Comience con una prueba gratuita de nuestras plataformas de salud impulsadas por IA.',
      keywords: 'precios de software de salud, costo de IA médica, suscripción de plataforma clínica',
      ogTitle: 'Planes de Precios de Nexus Biomedical',
      ogDescription: 'Soluciones de salud con IA asequibles para organizaciones de todos los tamaños',
      twitterTitle: 'Precios de Nexus',
      twitterDescription: 'Planes flexibles para atención médica impulsada por IA'
    }
  }
};

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
  updateMetaTag('property', 'og:locale', language === 'es' ? 'es_ES' : 'en_US');

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
  
  // Add alternate language links
  updateAlternateLinks(language);
}

/**
 * Update alternate language links for SEO
 * @param {string} currentLanguage - Current language
 */
function updateAlternateLinks(currentLanguage) {
  const baseUrl = window.location.origin + window.location.pathname;
  
  // Remove existing alternate links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove());
  
  // Add English alternate
  const enLink = document.createElement('link');
  enLink.rel = 'alternate';
  enLink.hreflang = 'en';
  enLink.href = baseUrl;
  document.head.appendChild(enLink);
  
  // Add Spanish alternate
  const esLink = document.createElement('link');
  esLink.rel = 'alternate';
  esLink.hreflang = 'es';
  esLink.href = `${baseUrl}?lang=es`;
  document.head.appendChild(esLink);
  
  // Add x-default
  const defaultLink = document.createElement('link');
  defaultLink.rel = 'alternate';
  defaultLink.hreflang = 'x-default';
  defaultLink.href = baseUrl;
  document.head.appendChild(defaultLink);
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

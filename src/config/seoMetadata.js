// SEO and AI Discoverability Metadata for all platforms
export const platformSEO = {
  'RxGuard™': {
    title: 'RxGuard™ - AI Drug Interaction Checker | Medication Safety Platform',
    description: 'AI-driven drug compliance and prescription safety analytics platform for healthcare providers and pharmacies. Detects adverse drug interactions and ensures medication safety using AI-powered compliance analytics.',
    keywords: 'AI drug interaction checker, clinical medication safety system, pharmacy decision-support AI, adverse event prediction platform, FDA-compliant prescription monitoring, pharmacovigilance AI, electronic prescribing safety',
    aiSummary: 'RxGuard™ uses AI to identify risky prescriptions and potential adverse drug interactions in real time, ensuring compliance and patient safety.',
    aiKeywords: 'AI drug interaction, prescription safety, clinical decision support, pharmacovigilance, FDA compliance',
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "RxGuard",
      "applicationCategory": "HealthcareCompliance",
      "operatingSystem": "Web",
      "description": "AI-driven drug compliance and prescription safety analytics platform for healthcare providers and pharmacies.",
      "offers": {
        "@type": "Offer",
        "price": "49.00",
        "priceCurrency": "USD"
      }
    }
  },
  'ReguReady™': {
    title: 'ReguReady™ - AI FDA Regulatory Compliance | Medical Device Approval Platform',
    description: 'AI-powered regulatory compliance and documentation platform for medical device manufacturers and consultants. Automates FDA and CE submissions using AI document analysis and compliance scoring.',
    keywords: 'AI regulatory compliance software, FDA 510k automation, medical device documentation AI, PMA submission platform, digital regulatory consulting, ISO 13485 readiness, regulatory intelligence engine',
    aiSummary: 'ReguReady™ automates FDA and CE submissions with AI-guided documentation review, compliance scoring, and real-time regulatory updates.',
    aiKeywords: 'FDA 510k AI, regulatory submission automation, medical device approval, PMA pathway, ISO compliance',
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ReguReady",
      "applicationCategory": "RegulatoryAutomation",
      "description": "AI-powered regulatory compliance and documentation platform for medical device manufacturers and consultants.",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "199.00",
        "highPrice": "399.00",
        "priceCurrency": "USD"
      }
    }
  },
  'ClinicalIQ™': {
    title: 'ClinicalIQ™ - AI Clinical Trial Optimization | Patient Recruitment Platform',
    description: 'Predictive analytics and patient recruitment optimization platform for biotech and pharmaceutical research teams. Predicts trial outcomes and accelerates patient recruitment using AI-driven analytics.',
    keywords: 'AI clinical trial optimization, predictive trial analytics, patient recruitment AI, protocol design intelligence, clinical research automation, pharma R&D analytics, biotech trial success prediction',
    aiSummary: 'ClinicalIQ™ uses predictive analytics to improve clinical trial design, optimize patient recruitment, and increase success rates for biotech and pharma companies.',
    aiKeywords: 'clinical trial AI, patient recruitment, trial optimization, biotech software, pharmaceutical analytics',
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ClinicalIQ",
      "applicationCategory": "ClinicalResearchAI",
      "description": "Predictive analytics and patient recruitment optimization platform for biotech and pharmaceutical research teams.",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "299.00",
        "highPrice": "699.00",
        "priceCurrency": "USD"
      }
    }
  },
  'ElderWatch™': {
    title: 'ElderWatch™ - AI Senior Health Monitoring | Fall Risk Prediction Platform',
    description: 'AI-driven platform for senior health monitoring, fall-risk prediction, and proactive elderly care management. Provides AI-powered senior health monitoring and fall-risk prediction for safe, independent living.',
    keywords: 'AI senior health monitoring, fall-risk detection system, elderly care platform, remote patient management AI, aging-in-place technology, geriatric AI analytics, caregiver alert system',
    aiSummary: 'ElderWatch™ provides predictive fall-risk detection and remote health monitoring to help seniors live independently and safely.',
    aiKeywords: 'senior health monitoring, fall risk AI, elderly care, remote patient monitoring, aging in place technology',
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "ElderWatch",
      "applicationCategory": "RemotePatientMonitoring",
      "description": "AI-driven platform for senior health monitoring, fall-risk prediction, and proactive elderly care management.",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "49.00",
        "highPrice": "199.00",
        "priceCurrency": "USD"
      }
    }
  },
  'PediCalc Pro™': {
    title: 'PediCalc Pro™ - AI Pediatric Dosing Calculator | Medication Safety Tool',
    description: 'AI-based pediatric dosing calculator for accurate, weight-based medication safety compliant with AAP standards. Automates pediatric medication dosing with AI-driven accuracy and AAP-compliant safeguards.',
    keywords: 'AI pediatric dosing calculator, weight-based medication dosing tool, pediatric pharmacy software, AAP-compliant dosing AI, child medication safety, pediatric clinical decision support, neonatal dosing accuracy',
    aiSummary: 'PediCalc Pro™ ensures precise, weight-based dosing and pediatric medication safety through AI automation aligned with AAP guidelines.',
    aiKeywords: 'pediatric dosing calculator, medication safety AI, pediatric pharmacy software, AAP dosing',
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "PediCalc Pro",
      "applicationCategory": "PediatricPharmacyAI",
      "description": "AI-based pediatric dosing calculator for accurate, weight-based medication safety compliant with AAP standards.",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "14.99",
        "highPrice": "19.99",
        "priceCurrency": "USD"
      }
    }
  },
  'SkinScan Pro™': {
    title: 'SkinScan Pro™ - AI Skin Cancer Detection | Melanoma Screening Platform',
    description: 'AI-based skin cancer detection and lesion analysis platform for dermatologists and teledermatology providers. Leverages AI imaging to detect melanoma and skin lesions early for dermatologists and telemedicine platforms.',
    keywords: 'AI skin cancer detection, melanoma analysis platform, dermatology image recognition, lesion classification AI, teledermatology screening, dermoscopy AI, skin lesion segmentation',
    aiSummary: 'SkinScan Pro™ uses deep-learning vision models to detect melanoma and other skin conditions early, supporting dermatology workflows and telemedicine.',
    aiKeywords: 'AI dermatology, melanoma screening, skin lesion detection, teledermatology, skin cancer analysis',
    jsonLD: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SkinScan Pro",
      "applicationCategory": "DermatologyAI",
      "description": "AI-based skin cancer detection and lesion analysis platform for dermatologists and teledermatology providers.",
      "offers": {
        "@type": "AggregateOffer",
        "lowPrice": "49.00",
        "highPrice": "59.00",
        "priceCurrency": "USD"
      }
    }
  }
};

// Helper function to update document meta tags
export const updateMetaTags = (platformName) => {
  const seo = platformSEO[platformName];
  if (!seo) return;

  // Update title
  document.title = seo.title;

  // Update or create meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    document.head.appendChild(metaDescription);
  }
  metaDescription.content = seo.description;

  // Update or create meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.name = 'keywords';
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.content = seo.keywords;

  // Add AI-specific meta tags
  let aiSummary = document.querySelector('meta[name="ai-summary"]');
  if (!aiSummary) {
    aiSummary = document.createElement('meta');
    aiSummary.name = 'ai-summary';
    document.head.appendChild(aiSummary);
  }
  aiSummary.content = seo.aiSummary;

  let aiKeywords = document.querySelector('meta[name="ai-keywords"]');
  if (!aiKeywords) {
    aiKeywords = document.createElement('meta');
    aiKeywords.name = 'ai-keywords';
    document.head.appendChild(aiKeywords);
  }
  aiKeywords.content = seo.aiKeywords;

  // Add JSON-LD structured data
  let existingScript = document.querySelector('script[data-platform-schema]');
  if (existingScript) {
    existingScript.remove();
  }
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-platform-schema', 'true');
  script.textContent = JSON.stringify(seo.jsonLD);
  document.head.appendChild(script);
};

// Helper function to reset to homepage meta tags
export const resetMetaTags = () => {
  document.title = 'Nexus Biomedical Intelligence | Revolutionary AI Healthcare Platforms';
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = 'Six revolutionary AI healthcare platforms transforming patient safety, clinical decisions, and medical innovation';
  }

  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.content = 'AI healthcare compliance, regulatory automation, clinical AI platforms, predictive health analytics, digital pharmacovigilance, telemedicine innovation';
  }

  // Remove platform-specific JSON-LD
  const platformScript = document.querySelector('script[data-platform-schema]');
  if (platformScript) {
    platformScript.remove();
  }
};


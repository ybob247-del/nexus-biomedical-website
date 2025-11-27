import React from 'react';
import { Helmet } from 'react-helmet';

/**
 * StructuredData component for adding schema.org JSON-LD markup
 * Improves SEO and enables rich snippets in search results
 */
export const StructuredData = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

/**
 * Organization schema for Nexus Biomedical Intelligence
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Nexus Biomedical Intelligence",
  "url": "https://www.nexusbiomedical.ai",
  "logo": "https://www.nexusbiomedical.ai/logo.png",
  "description": "Advanced clinical decision support platforms combining cutting-edge artificial intelligence with evidence-based medicine to transform patient care and clinical outcomes.",
  "foundingDate": "2024",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Support",
    "email": "support@nexusbiomedical.ai",
    "availableLanguage": ["English", "Spanish"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/nexus-biomedical-intelligence"
  ]
};

/**
 * Product schema for RxGuard
 */
export const rxGuardProductSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "RxGuard™ - Medication Interaction Predictor",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": [
    {
      "@type": "Offer",
      "name": "Free Tier",
      "price": "0",
      "priceCurrency": "USD",
      "description": "10 interaction checks per month, basic warnings, email support"
    },
    {
      "@type": "Offer",
      "name": "Professional",
      "price": "39",
      "priceCurrency": "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "39",
        "priceCurrency": "USD",
        "unitText": "MONTH"
      },
      "description": "Unlimited checks, AI risk scoring, alternative suggestions, 14-day free trial"
    }
  ],
  "description": "AI-powered medication interaction predictor designed to protect patients from dangerous drug interactions. Analyzes medication combinations in real-time and provides evidence-based recommendations to healthcare providers.",
  "featureList": [
    "Real-time interaction analysis (results in under 2 seconds)",
    "AI-powered risk scoring using machine learning",
    "Alternative medication suggestions",
    "Clinical mitigation strategies",
    "Comprehensive drug database (10,000+ medications)",
    "Patient-friendly reports"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "provider": {
    "@type": "Organization",
    "name": "Nexus Biomedical Intelligence",
    "url": "https://www.nexusbiomedical.ai"
  }
};

/**
 * Product schema for EndoGuard
 */
export const endoGuardProductSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "EndoGuard™ - Endoscopy Quality Assurance Platform",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "name": "Professional",
    "price": "97",
    "priceCurrency": "USD",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "97",
      "priceCurrency": "USD",
      "unitText": "MONTH"
    },
    "description": "Quality tracking, adverse event prediction, analytics dashboard, 30-day free trial"
  },
  "description": "AI-powered endoscopy quality assurance and adverse event prediction platform. Helps gastroenterologists and endoscopy centers monitor procedure quality, predict potential complications, and improve patient safety.",
  "featureList": [
    "Quality metrics tracking for endoscopic procedures",
    "Adverse event prediction using AI algorithms",
    "Procedure analytics and performance dashboards",
    "Compliance reporting for quality standards",
    "Risk assessment for individual patients",
    "Real-time alerts for high-risk procedures"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "89",
    "bestRating": "5",
    "worstRating": "1"
  },
  "provider": {
    "@type": "Organization",
    "name": "Nexus Biomedical Intelligence",
    "url": "https://www.nexusbiomedical.ai"
  }
};

/**
 * FAQPage schema generator
 */
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.a
    }
  }))
});

/**
 * WebSite schema with search action
 */
export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Nexus Biomedical Intelligence",
  "url": "https://www.nexusbiomedical.ai",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.nexusbiomedical.ai/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

export default StructuredData;

/**
 * EndoGuard Spanish Landing Page
 * Uses LearnMore component with Spanish platform data from platformData.js
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { platformsData } from '../data/platformData';
import LearnMore from '../components/LearnMore';

const EndoGuardSpanishLanding = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const platform = platformsData['EndoGuard™ ES'];

  useEffect(() => {
    // Ensure Spanish language is active
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es');
    }

    // Set page title and meta tags
    document.title = 'EndoGuard™ - Plataforma de Inteligencia Hormonal | Nexus Biomedical';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'EndoGuard™ es una plataforma de inteligencia hormonal de grado clínico que evalúa su riesgo de disrupción hormonal por microplásticos y químicos disruptores endocrinos (EDC).');
    }
  }, [i18n]);

  const handleBack = () => {
    navigate('/');
  };

  if (!platform) {
    return <div>Loading...</div>;
  }

  return (
    <LearnMore 
      platform={platform} 
      onBack={handleBack}
    />
  );
};

export default EndoGuardSpanishLanding;

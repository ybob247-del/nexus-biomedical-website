import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/platform-comparison.css';

const PlatformComparison = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const platforms = [
    {
      name: t('platformComparison.platforms.rxguard.name'),
      category: 'medication',
      tagline: t('platformComparison.platforms.rxguard.tagline'),
      price: t('platformComparison.platforms.rxguard.price'),
      trialDays: t('platformComparison.platforms.rxguard.trialDays'),
      bestFor: t('platformComparison.platforms.rxguard.bestFor'),
      keyFeatures: t('platformComparison.platforms.rxguard.features', { returnObjects: true }),
      url: '/rxguard'
    },
    {
      name: t('platformComparison.platforms.endoguard.name'),
      category: 'procedures',
      tagline: t('platformComparison.platforms.endoguard.tagline'),
      price: t('platformComparison.platforms.endoguard.price'),
      trialDays: t('platformComparison.platforms.endoguard.trialDays'),
      bestFor: t('platformComparison.platforms.endoguard.bestFor'),
      keyFeatures: t('platformComparison.platforms.endoguard.features', { returnObjects: true }),
      url: '/endoguard'
    },
    {
      name: t('platformComparison.platforms.elderwatch.name'),
      category: 'monitoring',
      tagline: t('platformComparison.platforms.elderwatch.tagline'),
      price: t('platformComparison.platforms.elderwatch.price'),
      trialDays: t('platformComparison.platforms.elderwatch.trialDays'),
      bestFor: t('platformComparison.platforms.elderwatch.bestFor'),
      keyFeatures: t('platformComparison.platforms.elderwatch.features', { returnObjects: true }),
      url: '/elderwatch'
    },
    {
      name: t('platformComparison.platforms.pedicalc.name'),
      category: 'medication',
      tagline: t('platformComparison.platforms.pedicalc.tagline'),
      price: t('platformComparison.platforms.pedicalc.price'),
      trialDays: t('platformComparison.platforms.pedicalc.trialDays'),
      bestFor: t('platformComparison.platforms.pedicalc.bestFor'),
      keyFeatures: t('platformComparison.platforms.pedicalc.features', { returnObjects: true }),
      url: '/pedicalc'
    },
    {
      name: t('platformComparison.platforms.clinicaliq.name'),
      category: 'research',
      tagline: t('platformComparison.platforms.clinicaliq.tagline'),
      price: t('platformComparison.platforms.clinicaliq.price'),
      trialDays: t('platformComparison.platforms.clinicaliq.trialDays'),
      bestFor: t('platformComparison.platforms.clinicaliq.bestFor'),
      keyFeatures: t('platformComparison.platforms.clinicaliq.features', { returnObjects: true }),
      url: '/clinicaliq'
    },
    {
      name: t('platformComparison.platforms.reguready.name'),
      category: 'regulatory',
      tagline: t('platformComparison.platforms.reguready.tagline'),
      price: t('platformComparison.platforms.reguready.price'),
      trialDays: t('platformComparison.platforms.reguready.trialDays'),
      bestFor: t('platformComparison.platforms.reguready.bestFor'),
      keyFeatures: t('platformComparison.platforms.reguready.features', { returnObjects: true }),
      url: '/reguready'
    },
    {
      name: t('platformComparison.platforms.skinscan.name'),
      category: 'diagnostics',
      tagline: t('platformComparison.platforms.skinscan.tagline'),
      price: t('platformComparison.platforms.skinscan.price'),
      trialDays: t('platformComparison.platforms.skinscan.trialDays'),
      bestFor: t('platformComparison.platforms.skinscan.bestFor'),
      keyFeatures: t('platformComparison.platforms.skinscan.features', { returnObjects: true }),
      url: '/skinscan'
    }
  ];

  const categories = [
    { id: 'all', label: t('platformComparison.categories.all') },
    { id: 'medication', label: t('platformComparison.categories.medication') },
    { id: 'procedures', label: t('platformComparison.categories.procedures') },
    { id: 'monitoring', label: t('platformComparison.categories.monitoring') },
    { id: 'research', label: t('platformComparison.categories.research') },
    { id: 'regulatory', label: t('platformComparison.categories.regulatory') },
    { id: 'diagnostics', label: t('platformComparison.categories.diagnostics') }
  ];

  const filteredPlatforms = selectedCategory === 'all' 
    ? platforms 
    : platforms.filter(p => p.category === selectedCategory);

  const handleSelectPlatform = (url) => {
    navigate(url);
  };

  return (
    <>
      <Header />
      <div className="comparison-page">
        <div className="comparison-hero">
          <h1>{t('platformComparison.hero.title')}</h1>
          <p>{t('platformComparison.hero.subtitle')}</p>
        </div>

        <div className="comparison-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="comparison-grid">
          {filteredPlatforms.map((platform, index) => (
            <div key={index} className="comparison-card">
              <div className="card-header">
                <h2>{platform.name}</h2>
                <p className="tagline">{platform.tagline}</p>
              </div>

              <div className="card-pricing">
                <div className="price">{platform.price}</div>
                <div className="trial">{platform.trialDays} {t('platformComparison.card.trialDays')}</div>
              </div>

              <div className="card-best-for">
                <h3>{t('platformComparison.card.bestFor')}</h3>
                <p>{platform.bestFor}</p>
              </div>

              <div className="card-features">
                <h3>{t('platformComparison.card.keyFeatures')}</h3>
                <ul>
                  {platform.keyFeatures.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
              </div>

              <button 
                className="select-btn"
                onClick={() => handleSelectPlatform(platform.url)}
              >
                {t('platformComparison.card.learnMore')}
              </button>
            </div>
          ))}
        </div>

        <div className="comparison-help">
          <h2>{t('platformComparison.help.title')}</h2>
          <p>{t('platformComparison.help.description')}</p>
          <button className="contact-btn" onClick={() => navigate('/contact')}>
            {t('platformComparison.help.contactSales')}
          </button>
        </div>

        <div className="comparison-faq">
          <h2>{t('platformComparison.faq.title')}</h2>
          
          <div className="faq-item">
            <h3>{t('platformComparison.faq.questions.multiplePlatforms.question')}</h3>
            <p>{t('platformComparison.faq.questions.multiplePlatforms.answer')}</p>
          </div>

          <div className="faq-item">
            <h3>{t('platformComparison.faq.questions.freeTrial.question')}</h3>
            <p>{t('platformComparison.faq.questions.freeTrial.answer')}</p>
          </div>

          <div className="faq-item">
            <h3>{t('platformComparison.faq.questions.switchPlatforms.question')}</h3>
            <p>{t('platformComparison.faq.questions.switchPlatforms.answer')}</p>
          </div>

          <div className="faq-item">
            <h3>{t('platformComparison.faq.questions.enterprisePricing.question')}</h3>
            <p>{t('platformComparison.faq.questions.enterprisePricing.answer')}</p>
          </div>

          <div className="faq-item">
            <h3>{t('platformComparison.faq.questions.hipaaCompliance.question')}</h3>
            <p>{t('platformComparison.faq.questions.hipaaCompliance.answer')}</p>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default PlatformComparison;

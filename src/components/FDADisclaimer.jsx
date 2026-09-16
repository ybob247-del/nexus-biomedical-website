import React from 'react';
import { useTranslation } from 'react-i18next';
import brand from '../config/brand';

export default function FDADisclaimer() {
  const { t } = useTranslation();
  // The consumer brand is an educational tool, not clinical decision support.
  const copy = brand.isConsumerBrand ? 'fdaDisclaimer.consumer' : 'fdaDisclaimer.nexus';
  return (
    <div style={{
      background: 'rgba(255, 193, 7, 0.1)',
      border: '2px solid #FFC107',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '2rem 0',
      maxWidth: '900px'
    }}>
      <h4 style={{
        color: '#F57C00',
        fontSize: '1.1rem',
        fontWeight: 700,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {t('fdaDisclaimer.title')}
      </h4>
      <p style={{
        color: '#424242',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        margin: 0
      }}>
        {t(`${copy}.before`)}<strong>{t(`${copy}.strong1`)}</strong>{t(`${copy}.middle`)}<strong>{t(`${copy}.strong2`)}</strong>{t(`${copy}.after`)}
      </p>
      <p style={{
        color: '#757575',
        fontSize: '0.85rem',
        marginTop: '1rem',
        marginBottom: 0,
        fontStyle: 'italic'
      }}>
        {t(`${copy}.footnote`)}
      </p>
    </div>
  );
}

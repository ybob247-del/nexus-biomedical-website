import React from 'react';

export default function FDADisclaimer() {
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
        ⚠️ Important Medical Disclaimer
      </h4>
      <p style={{
        color: '#424242',
        fontSize: '0.95rem',
        lineHeight: '1.6',
        margin: 0
      }}>
        This platform is a <strong>clinical decision support tool</strong> designed to assist healthcare providers and empower patients with evidence-based information. It is <strong>not intended to diagnose, treat, cure, or prevent any disease</strong> and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of information provided by this platform.
      </p>
      <p style={{
        color: '#757575',
        fontSize: '0.85rem',
        marginTop: '1rem',
        marginBottom: 0,
        fontStyle: 'italic'
      }}>
        This product is not FDA-cleared or approved. The AI-powered features are continuously being improved and validated.
      </p>
    </div>
  );
}

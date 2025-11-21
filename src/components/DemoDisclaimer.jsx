import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DemoDisclaimer Component
 * Prominent banner to show users they're viewing a demo with sample data
 * Includes call-to-action to sign up for full access
 */
export default function DemoDisclaimer({ platformName, dashboardUrl }) {
  const navigate = useNavigate();

  const handleGetFullAccess = () => {
    navigate(`/login?redirect=${encodeURIComponent(dashboardUrl)}`);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFA500 0%, #FF6B00 100%)',
      color: '#FFFFFF',
      padding: '1.5rem 2rem',
      borderRadius: '15px',
      marginBottom: '2rem',
      boxShadow: '0 8px 24px rgba(255, 165, 0, 0.3)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
        👁️ PREVIEW DEMO - SAMPLE DATA ONLY
      </div>
      <p style={{ fontSize: '1rem', marginBottom: '1rem', opacity: 0.95 }}>
        This demo shows <strong>pre-programmed scenarios</strong> to preview {platformName} features. 
        The full platform includes <strong>real-time data</strong>, personalized analysis, saved history, and complete functionality.
      </p>
      <button
        onClick={handleGetFullAccess}
        style={{
          background: '#FFFFFF',
          color: '#FF6B00',
          border: 'none',
          padding: '1rem 2.5rem',
          borderRadius: '30px',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        }}
      >
        🚀 Get Full Access - Sign Up Now
      </button>
    </div>
  );
}

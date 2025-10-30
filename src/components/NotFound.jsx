import React from 'react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          color: 'white',
          maxWidth: '600px'
        }}
      >
        {/* 404 Number */}
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: '120px',
            fontWeight: '800',
            margin: '0',
            lineHeight: '1',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          404
        </motion.h1>

        {/* Error Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '32px',
            fontWeight: '600',
            margin: '1.5rem 0',
            color: 'rgba(255,255,255,0.95)'
          }}
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: '18px',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '2.5rem'
          }}
        >
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to exploring our revolutionary AI healthcare platforms.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          {/* Back to Home Button */}
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'white',
              color: '#667eea',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            ← Back to Home
          </a>

          {/* Contact Support Button */}
          <a
            href="mailto:support@nexusbiomedical.ai"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              textDecoration: 'none',
              border: '2px solid rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
              e.target.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            Contact Support
          </a>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '1rem'
          }}>
            Popular Pages:
          </p>
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {[
              { name: 'RxGuard™', hash: '#rxguard' },
              { name: 'ReguReady™', hash: '#reguready' },
              { name: 'ClinicalIQ™', hash: '#clinicaliq' },
              { name: 'ElderWatch™', hash: '#elderwatch' },
              { name: 'PediCalc Pro™', hash: '#pedicalc' },
              { name: 'SkinScan Pro™', hash: '#skinscan' }
            ].map((link, idx) => (
              <a
                key={idx}
                href={`/${link.hash}`}
                style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '14px',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                {link.name}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: '3rem',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.6)'
          }}
        >
          <p>Nexus Biomedical Intelligence</p>
          <p style={{ marginTop: '0.5rem' }}>Revolutionary AI Healthcare Platforms</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;


import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import '../styles/shareable-result-card.css';

export default function ShareableResultCard({ results, onClose }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getRiskLevel = (score) => {
    if (score >= 60) return { level: 'High', color: '#ef4444', emoji: '🔴' };
    if (score >= 30) return { level: 'Moderate', color: '#f59e0b', emoji: '🟡' };
    return { level: 'Low', color: '#10b981', emoji: '🟢' };
  };

  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const element = cardRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `EndoGuard-Results-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async (platform) => {
    const shareText = `I just completed my hormone health assessment with EndoGuard™! 
My risk score: ${results.overallRisk.score}/100 (${getRiskLevel(results.overallRisk.score).level} Risk)

Take your FREE assessment: ${window.location.origin}/endoguard/assessment

#HormoneHealth #EndoGuard #WellnessJourney`;

    const shareUrl = `${window.location.origin}/endoguard/assessment`;

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        '_blank'
      );
    } else if (platform === 'facebook') {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
        '_blank'
      );
    } else if (platform === 'linkedin') {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        '_blank'
      );
    }
  };

  const risk = getRiskLevel(results.overallRisk.score);

  return (
    <div className="shareable-modal-overlay" onClick={onClose}>
      <div className="shareable-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        
        <h2 className="modal-title">Share Your Results</h2>
        <p className="modal-subtitle">Inspire others to take control of their hormone health!</p>

        {/* Shareable Card Preview */}
        <div className="card-preview-container">
          <div ref={cardRef} className="shareable-result-card">
            <div className="card-background">
              <div className="card-gradient"></div>
              <div className="card-pattern"></div>
            </div>

            <div className="card-content">
              <div className="card-header">
                <div className="brand-logo">
                  <span className="logo-icon">🧬</span>
                  <span className="brand-name">EndoGuard™</span>
                </div>
                <div className="card-tagline">Hormone Health Assessment</div>
              </div>

              <div className="card-body">
                <div className="result-showcase">
                  <div className="risk-emoji">{risk.emoji}</div>
                  <div className="risk-score-display" style={{ color: risk.color }}>
                    {results.overallRisk.score}
                  </div>
                  <div className="risk-level-label" style={{ color: risk.color }}>
                    {risk.level} Risk
                  </div>
                </div>

                <div className="result-stats">
                  <div className="stat-item">
                    <div className="stat-value">{results.edcExposure?.riskScore || 0}</div>
                    <div className="stat-label">EDC Exposure</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-value">{results.hormoneHealth?.symptomCount || 0}</div>
                    <div className="stat-label">Symptoms</div>
                  </div>
                  <div className="stat-divider"></div>
                  <div className="stat-item">
                    <div className="stat-value">{results.hormoneHealth?.systemsAffected?.length || 0}</div>
                    <div className="stat-label">Systems</div>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <div className="cta-text">Take your FREE assessment</div>
                <div className="website-url">nexusbiomedical.ai/endoguard</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="share-actions">
          <button 
            className="action-btn download-btn" 
            onClick={handleDownloadImage}
            disabled={isGenerating}
          >
            {isGenerating ? '⏳ Generating...' : '📥 Download Image'}
          </button>

          <div className="share-buttons">
            <button 
              className="share-btn twitter-btn" 
              onClick={() => handleShare('twitter')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter
            </button>
            <button 
              className="share-btn facebook-btn" 
              onClick={() => handleShare('facebook')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
            <button 
              className="share-btn linkedin-btn" 
              onClick={() => handleShare('linkedin')}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div>

        <div className="privacy-note">
          <span className="privacy-icon">🔒</span>
          Your personal information is never shared. Only anonymized risk scores are included.
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/referral-dashboard.css';

export default function ReferralDashboard() {
  const { user, token } = useAuth();
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user && token) {
      loadReferralData();
    }
  }, [user, token]);

  const loadReferralData = async () => {
    try {
      // Get referral code
      const codeResponse = await fetch(`/api/referral/generate-code?user_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const codeData = await codeResponse.json();
      if (codeData.success) {
        setReferralCode(codeData.referralCode);
      }

      // Get referral stats
      const statsResponse = await fetch(`/api/referral/stats?user_id=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setReferrals(statsData.referrals || []);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform) => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    const message = `Join me on EndoGuard™ to take control of your hormone health! Use my referral code: ${referralCode}`;

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=${encodeURIComponent('Join EndoGuard™')}&body=${encodeURIComponent(message + '\n\n' + referralLink)}`;
    }
  };

  if (loading) {
    return <div className="referral-loading">Loading referral program...</div>;
  }

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'signed_up' || r.status === 'pending').length;
  const totalRewards = completedReferrals; // 1 free month per completed referral

  return (
    <div className="referral-dashboard">
      <div className="referral-header">
        <h2>🎁 Referral Rewards Program</h2>
        <p>Earn FREE premium months by inviting friends!</p>
      </div>

      {/* Referral Stats */}
      <div className="referral-stats">
        <div className="stat-card">
          <div className="stat-value">{completedReferrals}</div>
          <div className="stat-label">Completed Referrals</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingReferrals}</div>
          <div className="stat-label">Pending Referrals</div>
        </div>
        <div className="stat-card highlight">
          <div className="stat-value">{totalRewards}</div>
          <div className="stat-label">Free Months Earned</div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="referral-code-section">
        <h3>Your Referral Code</h3>
        <div className="code-display">
          <span className="code">{referralCode}</span>
          <button className="copy-btn" onClick={copyReferralLink}>
            {copied ? '✓ Copied!' : '📋 Copy Link'}
          </button>
        </div>
        <p className="code-info">
          Share this code with friends. When they sign up and complete an assessment, you both win!
        </p>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Share Your Code</h4>
              <p>Send your unique referral link to friends and family</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>They Sign Up</h4>
              <p>Your friend creates an account using your referral code</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>They Complete Assessment</h4>
              <p>Once they finish their first hormone health assessment</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>You Both Win!</h4>
              <p>You get 1 FREE month of Premium, they get started on their health journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="share-section">
        <h3>Share Your Link</h3>
        <div className="share-buttons">
          <button className="share-btn twitter" onClick={() => shareOnSocial('twitter')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </button>
          <button className="share-btn facebook" onClick={() => shareOnSocial('facebook')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
          <button className="share-btn linkedin" onClick={() => shareOnSocial('linkedin')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          <button className="share-btn email" onClick={() => shareOnSocial('email')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            Email
          </button>
        </div>
      </div>

      {/* Referral List */}
      {referrals.length > 0 && (
        <div className="referral-list">
          <h3>Your Referrals</h3>
          <div className="referrals">
            {referrals.map((referral, index) => (
              <div key={index} className={`referral-item ${referral.status}`}>
                <div className="referral-info">
                  <div className="referral-email">{referral.referred_email}</div>
                  <div className="referral-date">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className={`referral-status ${referral.status}`}>
                  {referral.status === 'completed' && '✅ Completed'}
                  {referral.status === 'signed_up' && '⏳ Signed Up'}
                  {referral.status === 'pending' && '📧 Invited'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

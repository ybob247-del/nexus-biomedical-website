import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/referral-program.css';

export default function ReferralProgram() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [referralCode, setReferralCode] = useState(null);
  const [stats, setStats] = useState(null);
  const [signups, setSignups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login?redirect=/referral');
      return;
    }

    loadReferralData();
  }, [user, token]);

  const loadReferralData = async () => {
    try {
      // Try to get existing stats
      let response = await fetch('/api/referrals/my-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        // Generate code if doesn't exist
        const generateResponse = await fetch('/api/referrals/generate-code', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const generateData = await generateResponse.json();
        if (generateData.success) {
          setReferralCode(generateData.code);
        }

        // Try to get stats again
        response = await fetch('/api/referrals/my-stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      const data = await response.json();
      if (data.success) {
        setReferralCode(data.referralCode);
        setStats(data.stats);
        setSignups(data.signups);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="referral-program">
        <div className="loading">Loading referral program...</div>
      </div>
    );
  }

  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  return (
    <div className="referral-program">
      <div className="referral-header">
        <h1>🎁 Referral Program</h1>
        <button onClick={() => navigate('/dashboard')} className="back-button">
          ← Back to Dashboard
        </button>
      </div>

      {/* Hero Section */}
      <div className="referral-hero">
        <h2>Earn Rewards by Sharing Nexus Biomedical</h2>
        <p>Invite friends and colleagues to join Nexus Biomedical and earn rewards for every successful referral!</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">{stats.totalSignups}</div>
            <div className="stat-label">Total Signups</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.totalConversions}</div>
            <div className="stat-label">Paid Conversions</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-value">${stats.totalRewardsEarned.toFixed(2)}</div>
            <div className="stat-label">Total Earned</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-value">${stats.pendingRewards.toFixed(2)}</div>
            <div className="stat-label">Pending Rewards</div>
          </div>
        </div>
      )}

      {/* Referral Code Section */}
      <div className="referral-code-section">
        <h3>Your Referral Code</h3>
        <div className="code-display">
          <span className="code">{referralCode}</span>
          <button onClick={copyCode} className="copy-button">
            {copied ? '✓ Copied!' : '📋 Copy Code'}
          </button>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="referral-link-section">
        <h3>Your Referral Link</h3>
        <div className="link-display">
          <input 
            type="text" 
            value={referralLink} 
            readOnly 
            className="link-input"
          />
          <button onClick={copyReferralLink} className="copy-button">
            {copied ? '✓ Copied!' : '🔗 Copy Link'}
          </button>
        </div>
        <p className="link-hint">Share this link with friends to automatically apply your referral code</p>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h3>How It Works</h3>
        <div className="steps-grid">
          <div className="step">
            <div className="step-number">1</div>
            <h4>Share Your Link</h4>
            <p>Send your unique referral link to friends, colleagues, or on social media</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h4>They Sign Up</h4>
            <p>When someone signs up using your link, they get a special welcome bonus</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h4>You Both Win</h4>
            <p>When they subscribe to a paid plan, you earn $20 credit and they get 10% off their first month!</p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      {signups && signups.length > 0 && (
        <div className="referral-history">
          <h3>Referral History</h3>
          <div className="table-container">
            <table className="referrals-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Signed Up</th>
                  <th>Status</th>
                  <th>Reward</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup) => (
                  <tr key={signup.id}>
                    <td>
                      <div className="user-info">
                        <div className="user-name">{signup.referredName || 'Anonymous'}</div>
                        <div className="user-email">{signup.referredEmail}</div>
                      </div>
                    </td>
                    <td>{new Date(signup.signedUpAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${signup.converted ? 'converted' : 'pending'}`}>
                        {signup.converted ? '✓ Converted' : '⏳ Trial'}
                      </span>
                    </td>
                    <td>
                      {signup.converted ? (
                        <span className="reward-amount">
                          ${signup.rewardAmount.toFixed(2)}
                          {signup.rewardGranted ? ' ✓' : ' (pending)'}
                        </span>
                      ) : (
                        <span className="reward-pending">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {signups && signups.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎯</div>
          <h3>No referrals yet</h3>
          <p>Start sharing your referral link to earn rewards!</p>
        </div>
      )}
    </div>
  );
}

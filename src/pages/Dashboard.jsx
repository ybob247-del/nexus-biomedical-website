/**
 * User Dashboard
 * View subscriptions and access platforms
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';

const Dashboard = () => {
  const { user, logout, token, isAuthenticated } = useAuth();
  const [trials, setTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me.js', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setTrials(data.trials || []);
          setEmailVerified(!!data.user?.email_verified_at);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isAuthenticated, token, navigate]);

  const platforms = [
    {
      id: 'rxguard',
      name: 'RxGuard™',
      description: 'AI-powered medication interaction checker',
      color: 'from-cyan-500 to-cyan-600',
      icon: '💊',
      url: '/rxguard-dashboard',
      comingSoon: false
    },
    {
      id: 'endoguard',
      name: 'EndoGuard™',
      description: 'Clinical-grade hormone intelligence platform',
      color: 'from-cyan-500 to-cyan-600',
      icon: '🛡️',
      url: '/endoguard-assessment',
      comingSoon: false
    },
    {
      id: 'elderwatch',
      name: 'ElderWatch™',
      description: 'Senior health monitoring and predictive analytics',
      color: 'from-orange-500 to-orange-600',
      icon: '👴',
      url: '/elderwatch',
      comingSoon: true
    },
  ];

  const getTrialStatus = (platformId) => {
    const trial = trials.find(t => t.platform_id === platformId);
    if (!trial) return null;
    
    const daysRemaining = Math.ceil((new Date(trial.trial_end) - new Date()) / (1000 * 60 * 60 * 24));
    return {
      ...trial,
      daysRemaining,
      isActive: daysRemaining > 0
    };
  };

  const handleStartTrial = async (platformId) => {
    if (!emailVerified) {
      alert('Please verify your email before starting a trial');
      return;
    }

    try {
      const response = await fetch('/api/trials/start.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ platformId }),
      });

      if (response.ok) {
        // Refresh trials
        const userResponse = await fetch('/api/auth/me.js', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await userResponse.json();
        setTrials(data.trials || []);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to start trial');
      }
    } catch (error) {
      console.error('Failed to start trial:', error);
      alert('Failed to start trial');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a1628] via-[#0f1b2e] to-[#1a2942]">
        <StarryBackground />
        <div className="text-center relative z-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1b2e] to-[#1a2942] relative">
      <StarryBackground />
      
      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-300 mt-2">
                Welcome back, {user?.firstName || user?.email}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm"
              >
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Email Verification Warning */}
        {!emailVerified && (
          <div className="max-w-7xl mx-auto mb-8">
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="text-yellow-400 text-2xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                    Email Verification Required
                  </h3>
                  <p className="text-gray-200 mb-3">
                    Please verify your email address to start free trials and access platforms.
                  </p>
                  <p className="text-sm text-gray-300">
                    Check your inbox for a verification email from Nexus Biomedical Intelligence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Platform Cards */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Your Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform) => {
              const trialStatus = getTrialStatus(platform.id);
              const hasActiveTrial = trialStatus?.isActive;
              
              return (
                <div
                  key={platform.id}
                  className="bg-gradient-to-br from-[#1a2942] to-[#0f1b2e] rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-all shadow-lg hover:shadow-cyan-500/20"
                >
                  {/* Platform Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{platform.icon}</div>
                    {platform.comingSoon && (
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs font-semibold">
                        COMING SOON
                      </span>
                    )}
                    {hasActiveTrial && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-semibold">
                        ACTIVE TRIAL
                      </span>
                    )}
                  </div>

                  {/* Platform Info */}
                  <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                  <p className="text-gray-400 mb-4 text-sm min-h-[40px]">
                    {platform.description}
                  </p>

                  {/* Trial Status */}
                  {trialStatus && (
                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">Trial Status:</span>
                        <span className={`font-semibold ${trialStatus.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          {trialStatus.isActive 
                            ? `${trialStatus.daysRemaining} days left` 
                            : 'Expired'}
                        </span>
                      </div>
                      {trialStatus.usage_count !== undefined && (
                        <div className="flex items-center justify-between text-sm mt-2">
                          <span className="text-gray-300">Usage:</span>
                          <span className="text-cyan-400 font-semibold">
                            {trialStatus.usage_count} / {trialStatus.usage_limit || '∞'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {platform.comingSoon ? (
                    <button
                      disabled
                      className="w-full px-4 py-3 bg-gray-700/50 text-gray-400 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Join Waitlist
                    </button>
                  ) : hasActiveTrial ? (
                    <Link
                      to={platform.url}
                      className={`block w-full text-center px-4 py-3 bg-gradient-to-r ${platform.color} text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all`}
                    >
                      Launch Platform
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleStartTrial(platform.id)}
                      disabled={!emailVerified}
                      className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                        emailVerified
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Start Free Trial
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="max-w-7xl mx-auto mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Need help?{' '}
            <a href="mailto:support@nexusbiomedical.ai" className="text-cyan-400 hover:text-cyan-300">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

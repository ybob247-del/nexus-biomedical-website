/**
 * User Dashboard with Free Trial Support
 * View subscriptions, trials, and access platforms
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, token, isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [platformAccess, setPlatformAccess] = useState({});
  const [isBetaTester, setIsBetaTester] = useState(false);
  const [betaExpiresAt, setBetaExpiresAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const platforms = [
    { id: 'RxGuard', name: 'RxGuard', description: 'Drug interaction detection', url: '/rxguard', trialDays: 14, usageLimit: 100 },
    { id: 'PediCalc', name: 'PediCalc Pro', description: 'Pediatric dosing calculator', url: '/pedicalc', trialDays: 14, usageLimit: 50 },
    { id: 'MedWatch', name: 'MedWatch', description: 'Clinical guideline search', url: '/medwatch', trialDays: 14, usageLimit: 100 },
    { id: 'ElderWatch', name: 'ElderWatch', description: 'Geriatric risk assessment', url: '/elderwatch', trialDays: 14, usageLimit: 100 },
    { id: 'ReguReady', name: 'ReguReady', description: 'FDA compliance assistant', url: '/reguready', trialDays: 14, usageLimit: 50 },
    { id: 'ClinicalIQ', name: 'ClinicalIQ', description: 'Evidence-based protocols', url: '/clinicaliq', trialDays: 14, usageLimit: 100 },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch user info and subscriptions
        const userResponse = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setSubscriptions(userData.subscriptions || []);
          setIsBetaTester(userData.is_beta_tester || false);
          setBetaExpiresAt(userData.beta_access_expires);
        }

        // Fetch access status for each platform
        const accessPromises = platforms.map(async (platform) => {
          try {
            const response = await fetch(`/api/trial/check-access?platform=${platform.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              return { platform: platform.id, ...data };
            }
          } catch (error) {
            console.error(`Failed to check access for ${platform.id}:`, error);
          }
          return { platform: platform.id, canAccess: false, accessType: 'none' };
        });

        const accessResults = await Promise.all(accessPromises);
        const accessMap = {};
        accessResults.forEach((result) => {
          accessMap[result.platform] = result;
        });
        setPlatformAccess(accessMap);

      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, token, navigate]);

  const handleStartTrial = async (platformId) => {
    try {
      const response = await fetch('/api/trial/activate-platform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ platform: platformId }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}\n\nYou have ${data.trial.daysRemaining} days and ${data.trial.usageLimit} uses.`);
        
        // Refresh access status
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`❌ ${error.message || error.error}`);
      }
    } catch (error) {
      console.error('Failed to start trial:', error);
      alert('Failed to start trial. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getBetaDaysRemaining = () => {
    if (!betaExpiresAt) return 0;
    const days = Math.ceil((new Date(betaExpiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back, {user?.firstName || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Beta Tester Banner */}
      {isBetaTester && getBetaDaysRemaining() > 0 && (
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">🎉 Beta Tester</h3>
                <p className="text-gray-300">
                  You have <span className="font-bold text-cyan-400">{getBetaDaysRemaining()} days</span> of free access to all platforms
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Beta access expires</p>
                <p className="text-white font-semibold">{new Date(betaExpiresAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Active Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{sub.platform}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                    {sub.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Renews: {new Date(sub.current_period_end).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Platform Access */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Your Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const access = platformAccess[platform.id] || { canAccess: false, accessType: 'none' };
            const hasAccess = access.canAccess;
            const accessType = access.accessType;

            return (
              <div
                key={platform.id}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                  {accessType !== 'none' && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        accessType === 'paid'
                          ? 'bg-green-500/20 text-green-300'
                          : accessType === 'trial'
                          ? 'bg-blue-500/20 text-blue-300'
                          : accessType === 'beta'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {accessType}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 mb-4 text-sm">{platform.description}</p>

                {/* Trial/Usage Stats */}
                {hasAccess && accessType !== 'paid' && (
                  <div className="mb-4 space-y-2">
                    {access.trialDaysRemaining !== null && (
                      <div className="text-sm">
                        <span className="text-gray-400">Days remaining:</span>{' '}
                        <span className="text-white font-semibold">{access.trialDaysRemaining}</span>
                      </div>
                    )}
                    {access.usageCount !== null && access.usageLimit !== null && (
                      <div className="text-sm">
                        <span className="text-gray-400">Usage:</span>{' '}
                        <span className="text-white font-semibold">
                          {access.usageCount}/{access.usageLimit}
                        </span>
                        <div className="w-full bg-white/10 rounded-full h-2 mt-1">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${(access.usageCount / access.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {hasAccess ? (
                  <Link
                    to={platform.url}
                    className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Launch Platform
                  </Link>
                ) : accessType === 'none' ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleStartTrial(platform.id)}
                      className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500/80 to-purple-500/80 text-white rounded-lg font-semibold hover:from-cyan-500 hover:to-purple-500 transition-all"
                    >
                      Start {platform.trialDays}-Day Free Trial
                    </button>
                    <Link
                      to="/pricing"
                      className="inline-block w-full text-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-all"
                    >
                      or Subscribe Now
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/pricing"
                    className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Upgrade to Continue
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <Link to="/" className="text-gray-400 hover:text-gray-300">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;


/**
 * User Dashboard
 * View subscriptions and access platforms
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, token, isAuthenticated, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activatingTrial, setActivatingTrial] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchSubscriptions = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setSubscriptions(data.subscriptions || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [isAuthenticated, token, navigate, authLoading]);

  const platforms = [
    { 
      id: 'rxguard', 
      name: 'RxGuard™', 
      description: 'AI-powered medication safety and drug interaction analysis',
      icon: '💊',
      gradient: 'from-cyan-500 to-blue-600',
      url: '/rxguard' 
    },
    { 
      id: 'endoguard', 
      name: 'EndoGuard™', 
      description: 'Advanced endoscopy image analysis and polyp detection',
      icon: '🔬',
      gradient: 'from-purple-500 to-pink-600',
      url: '/endoguard' 
    },
  ];

  const hasAccessToPlatform = (platformName) => {
    return subscriptions.some(
      (sub) => sub.platform === platformName && (sub.status === 'active' || sub.status === 'trialing')
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartTrial = async (platformId) => {
    setActivatingTrial(platformId);
    
    try {
      const response = await fetch('/api/trials/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ platform: platformId }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`🎉 ${data.trialDays}-day free trial activated for ${platformId}!\n\nYou now have access until ${new Date(data.trialEnd).toLocaleDateString()}`);
        window.location.reload();
      } else if (data.alreadyUsedTrial) {
        alert('You have already used your free trial for this platform. Please subscribe to continue.');
        navigate('/pricing');
      } else if (data.hasAccess) {
        alert('You already have active access to this platform!');
        window.location.reload();
      } else {
        alert(data.error || 'Failed to activate trial. Please try again.');
      }
    } catch (error) {
      console.error('Trial activation error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setActivatingTrial(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-400 mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome Back!
              </h1>
              <p className="text-xl text-gray-300">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-white rounded-xl font-semibold transition-all border border-red-500/30 hover:border-red-400/50 hover:shadow-lg hover:shadow-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Your Subscriptions
          </h2>
          {subscriptions.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-12 text-center border border-purple-500/20 shadow-2xl">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-300 text-lg mb-6">You don't have any active subscriptions yet.</p>
              <p className="text-gray-400 mb-8">Start a free trial or subscribe to access our AI-powered platforms</p>
              <Link
                to="/pricing"
                className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              >
                View Pricing Plans
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{sub.platform}</h3>
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        sub.status === 'active'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : sub.status === 'trialing'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    {sub.trial_end
                      ? `Trial ends: ${new Date(sub.trial_end).toLocaleDateString()}`
                      : `Renews: ${new Date(sub.current_period_end).toLocaleDateString()}`}
                  </p>
                  {sub.cancel_at_period_end && (
                    <p className="text-sm text-yellow-400 mb-4 flex items-center gap-2">
                      <span>⚠️</span> Cancels at period end
                    </p>
                  )}
                  <Link
                    to={`/${sub.platform.toLowerCase()}`}
                    className="inline-block w-full text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Launch Platform →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Access */}
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Available Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {platforms.map((platform) => {
              const hasAccess = hasAccessToPlatform(platform.name);
              return (
                <div
                  key={platform.name}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 shadow-2xl hover:shadow-cyan-500/30 transition-all hover:scale-[1.02]"
                >
                  {/* Platform icon */}
                  <div className="text-6xl mb-4">{platform.icon}</div>
                  
                  {/* Platform info */}
                  <h3 className="text-2xl font-bold text-white mb-3">{platform.name}</h3>
                  <p className="text-gray-300 mb-6 text-base leading-relaxed">{platform.description}</p>
                  
                  {/* Action buttons */}
                  {hasAccess ? (
                    <Link
                      to={platform.url}
                      className={`inline-block w-full text-center px-6 py-4 bg-gradient-to-r ${platform.gradient} text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105`}
                    >
                      Launch Platform →
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => handleStartTrial(platform.id)}
                        disabled={activatingTrial === platform.id}
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-green-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:hover:scale-100"
                      >
                        {activatingTrial === platform.id ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            Activating...
                          </span>
                        ) : (
                          '🎁 Start 14-Day Free Trial'
                        )}
                      </button>
                      <Link
                        to="/pricing"
                        className="inline-block w-full text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20 hover:border-white/30"
                      >
                        View Pricing
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Back to Home */}
        <div className="max-w-7xl mx-auto text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all text-lg font-semibold"
          >
            <span>←</span> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

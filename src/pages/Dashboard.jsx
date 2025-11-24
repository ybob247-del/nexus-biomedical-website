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
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) {
      return; // Still loading auth
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

        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.subscriptions || []);
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [isAuthenticated, token, navigate, authLoading]);

  const platforms = [
    { name: 'RxGuard', description: 'Medication safety and drug interaction checker', url: '/rxguard' },
    { name: 'ReguReady', description: 'Regulatory compliance and documentation', url: '/reguready' },
    { name: 'ClinicalIQ', description: 'Clinical decision support system', url: '/clinicaliq' },
    { name: 'PediCalc Pro', description: 'Pediatric medication dosing calculator', url: '/pedicalc' },
    { name: 'SkinSense AI', description: 'Skin cancer detection and analysis', url: '/skinsense' },
    { name: 'DiagnoVision', description: 'Medical image analysis and diagnosis', url: '/diagnovision' },
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

  // Show loading spinner while auth or data is loading
  if (authLoading || loading) {
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

      {/* Active Subscriptions */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Your Subscriptions</h2>
        {subscriptions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <p className="text-gray-300 mb-4">You don't have any active subscriptions yet.</p>
            <Link
              to="/pricing"
              className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              View Pricing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((sub, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">{sub.platform}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sub.status === 'active'
                        ? 'bg-green-500/20 text-green-300'
                        : sub.status === 'trialing'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-300'
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
                  <p className="text-sm text-yellow-400 mb-4">
                    Cancels at period end
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform Access */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-4">Your Platforms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platforms.map((platform) => {
            const hasAccess = hasAccessToPlatform(platform.name);
            return (
              <div
                key={platform.name}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/15 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{platform.name}</h3>
                <p className="text-gray-400 mb-4 text-sm">{platform.description}</p>
                {hasAccess ? (
                  <Link
                    to={platform.url}
                    className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                  >
                    Launch Platform
                  </Link>
                ) : (
                  <Link
                    to="/pricing"
                    className="inline-block w-full text-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
                  >
                    Subscribe
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


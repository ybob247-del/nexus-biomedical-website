/**
 * TrialGate Component
 * Checks if user has active trial or subscription for a platform
 * Blocks access if trial expired and redirects to payment
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TrialGate({ platform, children }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [access, setAccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAccess();
  }, [user, token, platform]);

  const checkAccess = async () => {
    if (!user || !token) {
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }

    setChecking(true);
    setError(null);

    try {
      const response = await fetch('/api/trial?action=check-access', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check access');
      }

      // Check if user has access to this specific platform
      const platformTrialResponse = await fetch(`/api/platform-access/check?platform=${platform}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const platformData = await platformTrialResponse.json();

      setAccess(platformData);
      setChecking(false);

    } catch (err) {
      console.error('Access check error:', err);
      setError(err.message);
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Checking access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // If user has access, render the platform
  if (access && access.hasAccess) {
    return (
      <>
        {/* Trial Status Banner */}
        {access.accessType === 'trial' && access.daysRemaining !== null && (
          <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-500/30 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white text-sm font-medium">
                  Free Trial: {access.daysRemaining} {access.daysRemaining === 1 ? 'day' : 'days'} remaining
                </span>
              </div>
              <button
                onClick={() => navigate(`/pricing/${platform.toLowerCase()}`)}
                className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-sm rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}
        {children}
      </>
    );
  }

  // If no access, show payment gate
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-yellow-400 text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-white mb-4">Trial Expired</h2>
        <p className="text-gray-300 mb-6">
          Your free trial for {platform} has ended. Upgrade to continue using this platform.
        </p>
        
        {access && access.message && (
          <p className="text-sm text-gray-400 mb-6">{access.message}</p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate(`/pricing/${platform.toLowerCase()}`)}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            View Pricing & Upgrade
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-white/5 border border-gray-600 text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

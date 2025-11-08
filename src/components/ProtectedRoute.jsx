/**
 * Protected Route Component
 * Wraps platform pages to ensure user has valid subscription
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, platform }) => {
  const { isAuthenticated, checkPlatformAccess, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccess = async () => {
      if (authLoading) {
        return; // Wait for auth to load
      }

      if (!isAuthenticated) {
        // Not logged in - redirect to login
        navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
        return;
      }

      // Check platform access
      const result = await checkPlatformAccess(platform);

      if (result.hasAccess) {
        setHasAccess(true);
        setChecking(false);
      } else {
        setError(result.error);
        setChecking(false);
        
        // Redirect based on error type
        if (result.redirectTo) {
          setTimeout(() => {
            navigate(result.redirectTo);
          }, 3000);
        }
      }
    };

    verifyAccess();
  }, [isAuthenticated, authLoading, platform, checkPlatformAccess, navigate]);

  // Show loading state
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Show access denied message
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <div className="text-red-400 text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-300 mb-6">
            {error || 'You do not have access to this platform.'}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Redirecting you in a moment...
          </p>
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            View Pricing
          </button>
        </div>
      </div>
    );
  }

  // User has access - render the platform
  return children;
};

export default ProtectedRoute;


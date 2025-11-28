/**
 * Protected Route Component
 * Wraps platform pages to ensure user has valid subscription
 * Auto-activates free trial if user doesn't have access
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, platform }) => {
  const { isAuthenticated, checkPlatformAccess, loading: authLoading, token } = useAuth();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [error, setError] = useState(null);
  const [activatingTrial, setActivatingTrial] = useState(false);
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

      // If no platform specified, just check authentication (for general dashboard)
      if (!platform) {
        setHasAccess(true);
        setChecking(false);
        return;
      }

      // Check platform access
      const result = await checkPlatformAccess(platform);

      if (result.hasAccess) {
        setHasAccess(true);
        setChecking(false);
      } else {
        // No access found - try to auto-activate free trial
        console.log('No access found, attempting to activate free trial for', platform);
        setActivatingTrial(true);
        
        try {
          const activateResponse = await fetch('/api/trials/activate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
              platform: platform.toLowerCase(),
              selectedPlan: 'monthly'
            })
          });

          const activateData = await activateResponse.json();

          if (activateResponse.ok && activateData.success) {
            // Trial activated successfully!
            console.log('Free trial activated successfully:', activateData);
            setHasAccess(true);
            setChecking(false);
            setActivatingTrial(false);
          } else {
            // Trial activation failed (maybe already used trial)
            console.error('Trial activation failed:', activateData);
            setError(activateData.error || 'Unable to activate free trial');
            setChecking(false);
            setActivatingTrial(false);
            
            // Redirect to pricing page
            setTimeout(() => {
              navigate(`/pricing/${platform.toLowerCase()}`);
            }, 3000);
          }
        } catch (activateError) {
          console.error('Trial activation error:', activateError);
          setError('Failed to activate free trial. Please try again.');
          setChecking(false);
          setActivatingTrial(false);
          
          // Redirect to pricing page
          setTimeout(() => {
            navigate(`/pricing/${platform.toLowerCase()}`);
          }, 3000);
        }
      }
    };

    verifyAccess();
  }, [isAuthenticated, authLoading, platform, checkPlatformAccess, navigate, token]);

  // Show loading state
  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white text-lg">
            {activatingTrial ? 'Activating your free trial...' : 'Verifying access...'}
          </p>
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
            Redirecting you to pricing...
          </p>
          <button
            onClick={() => navigate(`/pricing/${platform?.toLowerCase() || ''}`)}
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

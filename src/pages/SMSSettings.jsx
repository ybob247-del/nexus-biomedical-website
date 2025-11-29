/**
 * SMS Settings Page
 * Wrapper page for SMS notification settings with navigation
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SMSNotificationSettings from '../components/SMSNotificationSettings';
import StarryBackground from '../components/StarryBackground';

const SMSSettings = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <StarryBackground />
      
      {/* Header with Back Button */}
      <div className="relative z-10 pt-8 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-semibold mb-4"
          >
            <span>←</span> Back to Dashboard
          </button>
        </div>
      </div>

      {/* SMS Settings Component */}
      <div className="relative z-10">
        <SMSNotificationSettings />
      </div>
    </div>
  );
};

export default SMSSettings;

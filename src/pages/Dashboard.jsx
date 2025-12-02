/**
 * User Dashboard
 * View subscriptions and access platforms
 */

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PlanSelection from '../components/PlanSelection';
import { platformsData } from '../data/platformData';
import OnboardingTour from '../components/OnboardingTour';
import { mainDashboardTour } from '../config/tours';
import '../styles/tour.css';

const Dashboard = () => {
  const { user, logout, token, isAuthenticated, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activatingTrial, setActivatingTrial] = useState(null);
  const [showPlanSelection, setShowPlanSelection] = useState(null); // stores platform object
  const navigate = useNavigate();

  // Check if user is new (account created less than 24 hours ago)
  const isNewUser = user?.createdAt ? 
    (Date.now() - new Date(user.createdAt).getTime()) < 24 * 60 * 60 * 1000 : false;

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
      id: 'endoguard', 
      name: 'EndoGuard™', 
      tagline: 'Hormone Intelligence Platform',
      description: 'Clinical-grade hormone intelligence addressing the silent health crisis from microplastics and endocrine-disrupting chemicals',
      color: '#D946EF',
      gradient: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
      url: '/endoguard',
      comingSoon: false
    },
    { 
      id: 'rxguard', 
      name: 'RxGuard™', 
      tagline: 'Medication Safety Intelligence',
      description: 'AI-powered medication interaction checker that helps healthcare providers identify dangerous drug combinations',
      color: '#00A8CC',
      gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
      url: '/rxguard',
      comingSoon: false
    },
    { 
      id: 'elderwatch', 
      name: 'ElderWatch™', 
      tagline: 'Predictive Senior Care',
      description: 'Predictive health analytics platform that uses AI to monitor senior patients and predict health decline before symptoms emerge',
      color: '#FB923C',
      gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
      url: '/elderwatch',
      comingSoon: true
    },
    { 
      id: 'pedicalcpro', 
      name: 'PediCalc Pro™', 
      tagline: 'Pediatric Dosing Intelligence',
      description: 'AI-enhanced pediatric medication dosing calculator with precise, weight-based dosing recommendations',
      color: '#FDA4AF',
      gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 100%)',
      url: '/pedicalc',
      comingSoon: true
    },
    { 
      id: 'clinicaliq', 
      name: 'ClinicalIQ™', 
      tagline: 'Clinical Decision Support',
      description: 'AI-driven clinical decision support platform that analyzes patient data to provide evidence-based treatment recommendations',
      color: '#00D084',
      gradient: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)',
      url: '/clinicaliq',
      comingSoon: true
    },
    { 
      id: 'reguready', 
      name: 'ReguReady™', 
      tagline: 'FDA Regulatory Intelligence',
      description: 'Streamlined FDA regulatory compliance platform that guides medical device manufacturers through the 510(k) clearance process',
      color: '#B794F4',
      gradient: 'linear-gradient(135deg, #B794F4 0%, #9F7AEA 100%)',
      url: '/reguready',
      comingSoon: true
    },
    { 
      id: 'skinscan', 
      name: 'SkinScan Pro™', 
      tagline: 'Dermatology AI Analysis',
      description: 'AI-powered skin lesion analysis platform that helps detect potential melanoma and other skin conditions early',
      color: '#14B8A6',
      gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
      url: '/skinscan',
      comingSoon: true
    }
  ];

  const hasAccessToPlatform = (platformName) => {
    return subscriptions.some(
      (sub) => sub.platform.toLowerCase() === platformName.toLowerCase().replace('™', '') &&
               (sub.status === 'active' || sub.status === 'trialing')
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartTrial = async (platform) => {
    if (platform.comingSoon) {
      return;
    }

    // Show plan selection modal
    setShowPlanSelection(platform);
  };

  const handlePlanSelected = async (billingInterval) => {
    if (!showPlanSelection) return;

    const platform = showPlanSelection;
    setActivatingTrial(platform.id);
    setShowPlanSelection(null);

    try {
      const response = await fetch('/api/trials/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          platformId: platform.id,
          billingInterval,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to activate trial');
      }

      const data = await response.json();
      
      // Navigate to the platform
      navigate(platform.url);
    } catch (error) {
      console.error('Error activating trial:', error);
      alert('Failed to activate trial. Please try again.');
    } finally {
      setActivatingTrial(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
    <OnboardingTour 
      tourId={mainDashboardTour.tourId}
      steps={mainDashboardTour.steps}
      autoStart={true}
    />
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8 lg:p-12">
        {/* Header - Enhanced with better spacing */}
        <div className="max-w-7xl mx-auto mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                {isNewUser ? 'Welcome!' : 'Welcome Back!'}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 font-semibold">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-sm md:text-base text-gray-400 mt-1">{user?.email}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Link
                to="/compare-assessments"
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 hover:from-fuchsia-500/30 hover:to-purple-500/30 text-white rounded-2xl font-semibold transition-all border border-fuchsia-500/40 hover:border-fuchsia-400/60 hover:shadow-xl hover:shadow-fuchsia-500/30 text-lg text-center flex items-center justify-center gap-2"
              >
                <span>📊</span> Compare Assessments
              </Link>
              <Link
                to="/settings/sms"
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white rounded-2xl font-semibold transition-all border border-purple-500/40 hover:border-purple-400/60 hover:shadow-xl hover:shadow-purple-500/30 text-lg text-center flex items-center justify-center gap-2"
                data-tour="settings-link"
              >
                <span>📱</span> SMS Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-white rounded-2xl font-semibold transition-all border border-red-500/40 hover:border-red-400/60 hover:shadow-xl hover:shadow-red-500/30 text-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Active Subscriptions - Enhanced cards */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 md:mb-8 px-2" data-tour="subscription-status">
            Active Subscriptions
          </h2>
          {subscriptions.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-16 text-center border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <div className="text-7xl md:text-8xl mb-6">📋</div>
              <p className="text-gray-200 text-xl md:text-2xl mb-4 font-semibold">You don't have any active subscriptions yet.</p>
              <p className="text-gray-400 text-lg md:text-xl mb-10">Start a free trial or subscribe to access our AI-powered platforms</p>
              <Link
                to="/pricing"
                className="inline-block px-10 py-5 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              >
                View Pricing Plans
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((sub, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all transform hover:scale-105">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white">{sub.platform}</h3>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide ${
                        sub.status === 'active'
                          ? 'bg-green-500/30 text-green-200 border-2 border-green-400/50'
                          : sub.status === 'trialing'
                          ? 'bg-blue-500/30 text-blue-200 border-2 border-blue-400/50'
                          : 'bg-gray-500/30 text-gray-200 border-2 border-gray-400/50'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-base text-gray-300 mb-6">
                    {sub.trial_end
                      ? `Trial ends: ${new Date(sub.trial_end).toLocaleDateString()}`
                      : `Renews: ${new Date(sub.current_period_end).toLocaleDateString()}`}
                  </p>
                  {sub.cancel_at_period_end && (
                    <p className="text-sm text-yellow-300 mb-6 flex items-center gap-2 font-semibold">
                      <span>⚠️</span> Cancels at period end
                    </p>
                  )}
                  <Link
                    to={`/${sub.platform.toLowerCase()}`}
                    className="inline-block w-full text-center px-6 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                  >
                    Launch Platform →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Platforms - Homepage-style framed cards */}
        <div className="max-w-7xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 md:mb-8 px-2">
            Available Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" data-tour="platform-cards">
            {platforms.map((platform) => {
              const hasAccess = hasAccessToPlatform(platform.name);
              const tourAttr = platform.id === 'endoguard' ? { 'data-tour': 'endoguard-card' } : 
                               platform.id === 'rxguard' ? { 'data-tour': 'rxguard-card' } : {};
              return (
                <div
                  {...tourAttr}
                  key={platform.id}
                  className="group relative"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '2.5rem',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${platform.color}40`;
                    e.currentTarget.style.borderColor = platform.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  {/* Gradient accent bar */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: platform.gradient,
                    boxShadow: `0 0 20px ${platform.color}, 0 4px 10px ${platform.color}80`
                  }}></div>

                  {/* Platform Logo */}
                  <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    padding: '1rem'
                  }}>
                    <img 
                      src={`/logos/${platform.name.replace('™', '').replace(' ', '_')}_Logo_White_BG.png`}
                      alt={`${platform.name} Logo`}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Platform header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <h3 style={{
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      margin: 0,
                      color: '#FFFFFF',
                      letterSpacing: '-0.5px'
                    }}>
                      {platform.name}
                    </h3>
                    {platform.comingSoon && (
                      <span style={{
                        background: 'linear-gradient(135deg, #FFB800 0%, #FF4757 100%)',
                        color: 'white',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '20px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 10px rgba(255, 71, 87, 0.3)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: platform.color,
                    marginBottom: '1.25rem',
                    letterSpacing: '0.3px',
                    textShadow: `0 0 20px ${platform.color}80, 0 2px 4px rgba(0, 0, 0, 0.5)`,
                    filter: 'brightness(1.3)'
                  }}>
                    {platform.tagline}
                  </p>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#B8D4E8',
                    lineHeight: 1.7,
                    marginBottom: '2rem'
                  }}>
                    {platform.description}
                  </p>

                  {/* CTA Button */}
                  {hasAccess ? (
                    <Link
                      to={platform.url}
                      style={{
                        display: 'block',
                        background: platform.gradient,
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '0.85rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        textAlign: 'center',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 15px ${platform.color}40`,
                        width: '100%',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = `0 6px 20px ${platform.color}60`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = `0 4px 15px ${platform.color}40`;
                      }}
                    >
                      Launch Platform →
                    </Link>
                  ) : platform.comingSoon ? (
                    <button
                      disabled
                      style={{
                        background: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '0.85rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'not-allowed',
                        opacity: 0.6,
                        width: '100%',
                        letterSpacing: '0.5px'
                      }}
                    >
                      🚧 Coming Soon
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartTrial(platform)}
                      disabled={activatingTrial === platform.id}
                      style={{
                        background: platform.gradient,
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '0.85rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: activatingTrial === platform.id ? 'wait' : 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 4px 15px ${platform.color}40`,
                        width: '100%',
                        letterSpacing: '0.5px'
                      }}
                      onMouseEnter={(e) => {
                        if (activatingTrial !== platform.id) {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = `0 6px 20px ${platform.color}60`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = `0 4px 15px ${platform.color}40`;
                      }}
                    >
                      {activatingTrial === platform.id ? 'Starting...' : 
                       platform.id === 'endoguard' ? 'Start Free Assessment →' : 'Start 14-Day Free Trial →'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Plan Selection Modal */}
      {showPlanSelection && (
        <PlanSelection
          platform={showPlanSelection}
          onClose={() => setShowPlanSelection(null)}
          onSelectPlan={handlePlanSelected}
        />
      )}
    </div>
    </>
  );
};

export default Dashboard;

import { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './styles/nexus.css'
import './i18n' // Initialize i18n
import { initializeSEO } from './utils/seo'
import { trackPageView } from './utils/analytics'
import { initializeLanguagePreference } from './utils/languagePreference'
import StarryBackground from './components/StarryBackground'
import Header from './components/Header'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import FAQ from './components/FAQ'
import WhoBenefits from './components/WhoBenefits'
import Footer from './components/Footer'
import ScreenshotBugWidget from './components/ScreenshotBugWidget'
import LanguageToggle from './components/LanguageToggle'
import EarlyAdopterBanner from './components/EarlyAdopterBanner'
import AIChatbot from './components/AIChatbot'
import AssessmentPreview from './components/AssessmentPreview'
import ProtectedRoute from './components/ProtectedRoute'
import { platformsData } from './data/platformData'
import { StructuredData, organizationSchema, websiteSchema } from './components/StructuredData'

// Lazy load demo components for better performance
const RxGuardPrototype = lazy(() => import('./components/RxGuardPrototype'))
const ReguReadyPrototype = lazy(() => import('./components/ReguReadyPrototype'))
const ClinicalIQPrototype = lazy(() => import('./components/ClinicalIQPrototype'))
const ElderWatchPrototype = lazy(() => import('./components/ElderWatchPrototype'))
const PediCalcPrototype = lazy(() => import('./components/PediCalcPrototype'))
const SkinScanPrototype = lazy(() => import('./components/SkinScanPrototype'))
const EndoGuardPrototype = lazy(() => import('./components/EndoGuardPrototype'))
const AdminBetaInvites = lazy(() => import('./components/AdminBetaInvites'))
const About = lazy(() => import('./pages/About'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./components/TermsOfService'))
const HIPAACompliance = lazy(() => import('./components/HIPAACompliance'))
const BetaSignup = lazy(() => import('./components/BetaSignup'))
const LearnMore = lazy(() => import('./components/LearnMore'))
const PlatformsPage = lazy(() => import('./pages/PlatformsPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ProviderPricing = lazy(() => import('./pages/ProviderPricing'))
const RxGuardDashboard = lazy(() => import('./pages/RxGuardDashboard'))
const EndoGuardAssessment = lazy(() => import('./pages/EndoGuardAssessment'))
const EndoGuardDemo = lazy(() => import('./pages/EndoGuardDemo'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const MyAssessments = lazy(() => import('./pages/MyAssessments'))
const WaitlistAdmin = lazy(() => import('./pages/WaitlistAdmin'))
const NotifyWaitlist = lazy(() => import('./pages/NotifyWaitlist'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const PlatformComparison = lazy(() => import('./pages/PlatformComparison'))
const ReferralDashboard = lazy(() => import('./components/ReferralDashboard'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const SMSSettings = lazy(() => import('./pages/SMSSettings'))
const SMSHistory = lazy(() => import('./pages/SMSHistory'))
const AdminSMSAnalytics = lazy(() => import('./pages/AdminSMSAnalytics'))
const AdminTourAnalytics = lazy(() => import('./pages/AdminTourAnalytics'))
const SpanishLanding = lazy(() => import('./pages/SpanishLanding'))
const AdminABTests = lazy(() => import('./pages/AdminABTests'))
const AssessmentComparison = lazy(() => import('./components/AssessmentComparison'))
const EndoGuardSpanishLanding = lazy(() => import('./pages/EndoGuardSpanishLanding'))
const RxGuardSpanishLanding = lazy(() => import('./pages/RxGuardSpanishLanding'))
const AdminChatbotAnalytics = lazy(() => import('./pages/AdminChatbotAnalytics'))
const FAQPage = lazy(() => import('./pages/FAQPage'))
const ProgressDashboard = lazy(() => import('./pages/ProgressDashboard'))
const GoalSetting = lazy(() => import('./components/GoalSetting'))
const ProviderDashboard = lazy(() => import('./components/ProviderDashboard'))
const AcceptInvitation = lazy(() => import('./pages/AcceptInvitation'))
const PatientDetailView = lazy(() => import('./components/PatientDetailView'))
const AdminProviderManagement = lazy(() => import('./pages/AdminProviderManagement'))
const BetaSurvey = lazy(() => import('./pages/BetaSurvey'))
const AdminBetaFeedback = lazy(() => import('./pages/AdminBetaFeedback'))

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
    <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>Loading...</div>
  </div>
)

// Platform Page Component
function PlatformPage() {
  const navigate = useNavigate()
  const [showPrototype, setShowPrototype] = useState(false)

  // Get platform ID from URL path
  const platformId = window.location.pathname.replace('/', '')

  // Map URL params to platform data keys
  const platformMap = {
    'rxguard': 'RxGuard™',
    'reguready': 'ReguReady™',
    'clinicaliq': 'ClinicalIQ™',
    'elderwatch': 'ElderWatch™',
    'pedicalc': 'PediCalc Pro™',
    'skinscan': 'SkinScan Pro™',
    'endoguard': 'EndoGuard™'
  }

  const platformName = platformMap[platformId]
  const platform = platformsData[platformName]

  // If invalid platform, redirect to home
  useEffect(() => {
    if (!platform) {
      navigate('/')
    }
  }, [platform, navigate])

  if (!platform) {
    return null
  }

  const handleBackToHome = () => {
    navigate('/')
  }

  const handleTryDemo = () => {
    setShowPrototype(true)
  }

  const handleBackFromPrototype = () => {
    setShowPrototype(false)
  }

  const handleUpgrade = () => {
    alert('Stripe checkout coming soon! You\'ll be able to start your 14-day free trial here.')
  }

  if (showPrototype) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {platformId === 'rxguard' && <RxGuardPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {platformId === 'reguready' && <ReguReadyPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {platformId === 'clinicaliq' && <ClinicalIQPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {platformId === 'elderwatch' && <ElderWatchPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {platformId === 'pedicalc' && <PediCalcPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {platformId === 'skinscan' && <SkinScanPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {platformId === 'endoguard' && <EndoGuardPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
      </Suspense>
    )
  }

  return <LearnMore platform={platform} onBack={handleBackToHome} onTryDemo={handleTryDemo} />
}

// Homepage Component
function Homepage() {
  const navigate = useNavigate()

  const handleLearnMore = (platformName) => {
    // Convert platform name to URL-friendly format
    const urlMap = {
      'RxGuard™': 'rxguard',
      'ReguReady™': 'reguready',
      'ClinicalIQ™': 'clinicaliq',
      'ElderWatch™': 'elderwatch',
      'PediCalc Pro™': 'pedicalc',
      'SkinScan Pro™': 'skinscan',
      'EndoGuard™': 'endoguard'
    }
    
    const platformUrl = urlMap[platformName]
    if (platformUrl) {
      navigate(`/${platformUrl}`)
    }
  }

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <Header />
      <div className="nexus-app">
        <Hero />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <EarlyAdopterBanner />
        </div>
        <AssessmentPreview />
        <Platforms onLearnMore={handleLearnMore} />
        <WhoBenefits />
        <FAQ />
        <Footer />
      </div>
    </>
  )
}

// Force Vercel redeploy - URL routing fix
function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Initialize language preference on first load
  useEffect(() => {
    const preferredLanguage = initializeLanguagePreference();
    if (preferredLanguage !== i18n.language) {
      i18n.changeLanguage(preferredLanguage);
    }
  }, []);

  // Track page views with language dimension
  useEffect(() => {
    trackPageView(location.pathname, i18n.language);
  }, [location.pathname, i18n.language]);

  // Update SEO meta tags when language changes
  useEffect(() => {
    // Determine current page from URL path
    const path = window.location.pathname;
    let currentPage = 'home';
    
    if (path.includes('/about')) currentPage = 'about';
    else if (path.includes('/platforms') || path.includes('/rxguard') || path.includes('/endoguard') || path.includes('/elderwatch') || path.includes('/pedicalc') || path.includes('/clinicaliq') || path.includes('/reguready') || path.includes('/skinscan')) currentPage = 'platforms';
    else if (path.includes('/pricing')) currentPage = 'pricing';
    
    // Initialize SEO for current page and language
    initializeSEO(currentPage, i18n.language);
  }, [i18n.language]);

  return (
    <>
      <StarryBackground />
      <ScreenshotBugWidget />
      <LanguageToggle />
      <AIChatbot />
      <Routes>
      {/* Compliance Pages Routes */}
      <Route 
        path="/privacy" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPolicy />
          </Suspense>
        } 
      />
      <Route 
        path="/terms" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <TermsOfService />
          </Suspense>
        } 
      />
      <Route 
        path="/hipaa" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HIPAACompliance />
          </Suspense>
        } 
      />

      {/* Admin Panel Route */}
      <Route 
        path="/admin/beta-invites" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminBetaInvites />
          </Suspense>
        } 
      />

      {/* Platforms Selection Page */}
      <Route 
        path="/platforms" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PlatformsPage />
          </Suspense>
        } 
      />
      
      {/* Platform Comparison Page */}
      <Route 
        path="/compare" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PlatformComparison />
          </Suspense>
        } 
      />
      
      {/* Testimonials Page */}
      <Route 
        path="/testimonials" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Testimonials />
          </Suspense>
        } 
      />
      
      {/* Pricing Page Route */}
      <Route 
        path="/pricing/:platformId" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PricingPage />
          </Suspense>
        }
      />
      
      {/* Provider Pricing Route */}
      <Route 
        path="/provider-pricing" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProviderPricing />
          </Suspense>
        }
      />
      
      {/* RxGuard Dashboard Route */}
      <Route 
        path="/rxguard/dashboard" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute platform="rxguard">
              <RxGuardDashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />
      
      {/* EndoGuard Assessment Route - Unauthenticated access allowed for hybrid freemium model */}
      <Route 
        path="/endoguard/assessment" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <EndoGuardAssessment />
          </Suspense>
        } 
      />
      
      {/* EndoGuard Demo Results Route */}
      <Route 
        path="/endoguard/demo" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <EndoGuardDemo />
          </Suspense>
        } 
      />

      {/* Platform Routes */}
      <Route path="/rxguard" element={<PlatformPage />} />
      <Route path="/reguready" element={<PlatformPage />} />
      <Route path="/clinicaliq" element={<PlatformPage />} />
      <Route path="/elderwatch" element={<PlatformPage />} />
      <Route path="/pedicalc" element={<PlatformPage />} />
      <Route path="/skinscan" element={<PlatformPage />} />
      <Route path="/endoguard" element={<PlatformPage />} />

      {/* Dashboard Route */}
      <Route 
        path="/dashboard" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Progress Dashboard Route */}
      <Route 
        path="/progress" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <ProgressDashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Goal Setting Route */}
      <Route 
        path="/goals" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <GoalSetting />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Provider Portal Route */}
      <Route 
        path="/provider/dashboard" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <ProviderDashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Accept Provider Invitation Route (Public) */}
      <Route 
        path="/accept-invitation" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AcceptInvitation />
          </Suspense>
        } 
      />

      {/* Patient Detail View for Providers */}
      <Route 
        path="/provider/patient/:patientId" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <PatientDetailView />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Authentication Routes */}
      <Route 
        path="/login" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Signup />
          </Suspense>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPassword />
          </Suspense>
        } 
      />
      <Route 
        path="/reset-password" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ResetPassword />
          </Suspense>
        } 
      />
      
      {/* Beta Signup Route */}
      <Route 
        path="/beta-signup" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <BetaSignup />
          </Suspense>
        } 
      />

      {/* Spanish Landing Page Routes */}
      <Route 
        path="/es" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <SpanishLanding />
          </Suspense>
        } 
      />
      <Route 
        path="/es/inicio" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <SpanishLanding />
          </Suspense>
        }
      />
      <Route 
        path="/es/endoguard" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <EndoGuardSpanishLanding />
          </Suspense>
        }
      />
      <Route 
        path="/es/rxguard" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <RxGuardSpanishLanding />
          </Suspense>
        }
      />

      {/* About Page Route */}
      <Route 
        path="/about" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <About />
          </Suspense>
        } 
      />

      {/* My Assessments Route */}
      <Route 
        path="/my-assessments" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <MyAssessments />
          </Suspense>
        } 
      />

      {/* Referral Dashboard Route */}
      <Route 
        path="/referrals" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <ReferralDashboard />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Admin Waitlist Route */}
      <Route 
        path="/admin/waitlist" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <WaitlistAdmin />
          </Suspense>
        } 
      />

      {/* Admin Notify Waitlist Route */}
      <Route 
        path="/admin/notify-waitlist" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <NotifyWaitlist />
          </Suspense>
        } 
      />

      {/* Admin Analytics Route */}
      <Route 
        path="/admin/analytics" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Analytics />
          </Suspense>
        } 
      />

      {/* Legal Pages Routes */}
      <Route 
        path="/privacy-policy" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <PrivacyPolicy />
          </Suspense>
        } 
      />
      <Route 
        path="/terms-of-service" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <TermsOfService />
          </Suspense>
        } 
      />
      <Route 
        path="/hipaa-compliance" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <HIPAACompliance />
          </Suspense>
        } 
      />

      {/* SMS Settings Route */}
      <Route 
        path="/settings/sms" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <SMSSettings />
          </Suspense>
        } 
      />

      {/* SMS History Route */}
      <Route 
        path="/settings/sms-history" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <SMSHistory />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Admin SMS Analytics Route */}
      <Route 
        path="/admin/sms-analytics" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminSMSAnalytics />
          </Suspense>
        } 
      />

      {/* Admin Tour Analytics Route */}
      <Route 
        path="/admin/tour-analytics" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminTourAnalytics />
          </Suspense>
        } 
      />

      {/* Admin Chatbot Analytics Route */}
      <Route 
        path="/admin/chatbot-analytics" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminChatbotAnalytics />
          </Suspense>
        } 
      />

      {/* Assessment Comparison Route */}
      <Route 
        path="/compare-assessments" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <AssessmentComparison />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Admin A/B Tests Route */}
      <Route 
        path="/admin/ab-tests" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminABTests />
          </Suspense>
        } 
      />

      {/* Admin Provider Management Route */}
      <Route 
        path="/admin/providers" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminProviderManagement />
          </Suspense>
        } 
      />

      {/* Beta Survey Route */}
      <Route 
        path="/beta/survey" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <BetaSurvey />
            </ProtectedRoute>
          </Suspense>
        } 
      />

      {/* Admin Beta Feedback Route */}
      <Route 
        path="/admin/beta-feedback" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminBetaFeedback />
          </Suspense>
        } 
      />

      {/* FAQ Page Route */}
      <Route 
        path="/faq" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <FAQPage />
          </Suspense>
        } 
      />

      {/* Homepage Route */}
      <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  )
}

export default App
// Force deployment

import { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import './styles/nexus.css'
import './i18n' // Initialize i18n
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
import ProtectedRoute from './components/ProtectedRoute'
import { platformsData } from './data/platformData'

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
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const MyAssessments = lazy(() => import('./pages/MyAssessments'))
const WaitlistAdmin = lazy(() => import('./pages/WaitlistAdmin'))
const NotifyWaitlist = lazy(() => import('./pages/NotifyWaitlist'))
const Analytics = lazy(() => import('./pages/Analytics'))

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
      <Header />
      <div className="nexus-app">
        <Hero />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <EarlyAdopterBanner />
        </div>
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
  return (
    <>
      <StarryBackground />
      <ScreenshotBugWidget />
      <LanguageToggle />
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

      {/* Platform Routes */}
      <Route path="/rxguard" element={<PlatformPage />} />
      <Route path="/reguready" element={<PlatformPage />} />
      <Route path="/clinicaliq" element={<PlatformPage />} />
      <Route path="/elderwatch" element={<PlatformPage />} />
      <Route path="/pedicalc" element={<PlatformPage />} />
      <Route path="/skinscan" element={<PlatformPage />} />
      <Route path="/endoguard" element={<PlatformPage />} />

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

      {/* Homepage Route */}
      <Route path="/" element={<Homepage />} />
      </Routes>
    </>
  )
}

export default App
// Force deployment

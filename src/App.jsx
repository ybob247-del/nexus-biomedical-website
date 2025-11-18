import { useState, lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import './styles/nexus.css'
import StarryBackground from './components/StarryBackground'
import Header from './components/Header'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import LearnMore from './components/LearnMore'
import FeedbackWidget from './components/FeedbackWidget'
import ScreenshotBugWidget from './components/ScreenshotBugWidget'
import { platformsData } from './data/platformData'

// Lazy load demo components for better performance
const RxGuardPrototype = lazy(() => import('./components/RxGuardPrototype'))
const ReguReadyPrototype = lazy(() => import('./components/ReguReadyPrototype'))
const ClinicalIQPrototype = lazy(() => import('./components/ClinicalIQPrototype'))
const ElderWatchPrototype = lazy(() => import('./components/ElderWatchPrototype'))
const PediCalcPrototype = lazy(() => import('./components/PediCalcPrototype'))
const SkinScanPrototype = lazy(() => import('./components/SkinScanPrototype'))
const AdminBetaInvites = lazy(() => import('./components/AdminBetaInvites'))
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./components/TermsOfService'))
const HIPAACompliance = lazy(() => import('./components/HIPAACompliance'))

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
    'skinscan': 'SkinScan Pro™'
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
      'SkinScan Pro™': 'skinscan'
    }
    
    const platformUrl = urlMap[platformName]
    if (platformUrl) {
      navigate(`/${platformUrl}`)
    }
  }

  return (
    <>
      <StarryBackground />
      <Header />
      <div className="nexus-app">
        <Hero />
        <Platforms onLearnMore={handleLearnMore} />
        <FAQ />
        <Footer />
      </div>
      <ScreenshotBugWidget />
    </>
  )
}

// Force Vercel redeploy - URL routing fix
function App() {
  return (
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

      {/* Platform Routes */}
      <Route path="/rxguard" element={<PlatformPage />} />
      <Route path="/reguready" element={<PlatformPage />} />
      <Route path="/clinicaliq" element={<PlatformPage />} />
      <Route path="/elderwatch" element={<PlatformPage />} />
      <Route path="/pedicalc" element={<PlatformPage />} />
      <Route path="/skinscan" element={<PlatformPage />} />

      {/* Homepage Route */}
      <Route path="/" element={<Homepage />} />
      <Route path="*" element={<Homepage />} />
    </Routes>
  )
}

export default App

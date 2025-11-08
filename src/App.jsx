import { useState, lazy, Suspense } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import './styles/nexus.css'
import StarryBackground from './components/StarryBackground'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import LearnMore from './components/LearnMore'
// AdminProtectedRoute removed - password protection now built into AdminBetaInvites
import { platformsData } from './data/platformData'

// Lazy load demo components for better performance
const RxGuardPrototype = lazy(() => import('./components/RxGuardPrototype'))
const ReguReadyPrototype = lazy(() => import('./components/ReguReadyPrototype'))
const ClinicalIQPrototype = lazy(() => import('./components/ClinicalIQPrototype'))
const ElderWatchPrototype = lazy(() => import('./components/ElderWatchPrototype'))
const PediCalcPrototype = lazy(() => import('./components/PediCalcPrototype'))
const SkinScanPrototype = lazy(() => import('./components/SkinScanPrototype'))
const AdminBetaInvites = lazy(() => import('./components/AdminBetaInvites'))

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [showPrototype, setShowPrototype] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLearnMore = (platformName) => {
    setSelectedPlatform(platformsData[platformName])
  }

  const handleBackToHome = () => {
    setSelectedPlatform(null)
    navigate('/')
  }

  const handleTryDemo = (platformType) => {
    setShowPrototype(platformType)
  }

  const handleBackFromPrototype = () => {
    setShowPrototype(null)
  }

  const handleUpgrade = () => {
    alert('Stripe checkout coming soon! You\'ll be able to start your 14-day free trial here.')
  }

  const LoadingFallback = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>Loading...</div>
    </div>
  )

  return (
    <Routes>
      {/* Admin Panel Route */}
      <Route 
        path="/admin/beta-invites" 
        element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminBetaInvites />
          </Suspense>
        } 
      />

      {/* Main App Route */}
      <Route 
        path="/*" 
        element={
          <>
            {/* If showing a prototype, render it */}
            {showPrototype ? (
              <Suspense fallback={<LoadingFallback />}>
                {showPrototype === 'rxguard' && <RxGuardPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
                {showPrototype === 'reguready' && <ReguReadyPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
                {showPrototype === 'clinicaliq' && <ClinicalIQPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
                {showPrototype === 'elderwatch' && <ElderWatchPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
                {showPrototype === 'pedicalc' && <PediCalcPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
                {showPrototype === 'skinscan' && <SkinScanPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
              </Suspense>
            ) : selectedPlatform ? (
              /* If a platform is selected, show Learn More page */
              <LearnMore platform={selectedPlatform} onBack={handleBackToHome} onTryDemo={handleTryDemo} />
            ) : (
              /* Otherwise show the main homepage */
              <>
                <StarryBackground />
                <div className="nexus-app">
                  <Hero />
                  <Platforms onLearnMore={handleLearnMore} />
                  <FAQ />
                  <Footer />
                </div>
              </>
            )}
          </>
        } 
      />
    </Routes>
  )
}

export default App

// Force rebuild Sat Nov  8 17:05:29 EST 2025

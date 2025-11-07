import { useState, lazy, Suspense } from 'react'
import './styles/nexus.css'
import StarryBackground from './components/StarryBackground'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import LearnMore from './components/LearnMore'
import { platformsData } from './data/platformData'

// Lazy load demo components for better performance
const RxGuardPrototype = lazy(() => import('./components/RxGuardPrototype'))
const ReguReadyPrototype = lazy(() => import('./components/ReguReadyPrototype'))
const ClinicalIQPrototype = lazy(() => import('./components/ClinicalIQPrototype'))
const ElderWatchPrototype = lazy(() => import('./components/ElderWatchPrototype'))
const PediCalcPrototype = lazy(() => import('./components/PediCalcPrototype'))
const SkinScanPrototype = lazy(() => import('./components/SkinScanPrototype'))

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [showPrototype, setShowPrototype] = useState(null) // 'rxguard', 'reguready', 'clinicaliq', 'elderwatch', 'pedicalc', 'skinscan'

  const handleLearnMore = (platformName) => {
    setSelectedPlatform(platformsData[platformName])
  }

  const handleBackToHome = () => {
    setSelectedPlatform(null)
  }

  const handleTryDemo = (platformType) => {
    setShowPrototype(platformType)
  }

  const handleBackFromPrototype = () => {
    setShowPrototype(null)
  }

  const handleUpgrade = () => {
    // Will connect to Stripe checkout later
    alert('Stripe checkout coming soon! You\'ll be able to start your 14-day free trial here.')
  }

  // If showing a prototype, render it with Suspense for lazy loading
  if (showPrototype) {
    const LoadingFallback = () => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div style={{ color: '#60a5fa', fontSize: '1.5rem', fontWeight: 600 }}>Loading demo...</div>
      </div>
    )

    return (
      <Suspense fallback={<LoadingFallback />}>
        {showPrototype === 'rxguard' && <RxGuardPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {showPrototype === 'reguready' && <ReguReadyPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {showPrototype === 'clinicaliq' && <ClinicalIQPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {showPrototype === 'elderwatch' && <ElderWatchPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {showPrototype === 'pedicalc' && <PediCalcPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
        {showPrototype === 'skinscan' && <SkinScanPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />}
      </Suspense>
    )
  }

  // If a platform is selected, show Learn More page
  if (selectedPlatform) {
    return <LearnMore platform={selectedPlatform} onBack={handleBackToHome} onTryDemo={handleTryDemo} />
  }

  // Otherwise show the main homepage
  return (
    <>
      <StarryBackground />
      <div className="nexus-app">
        <Hero />
        <Platforms onLearnMore={handleLearnMore} />
        <FAQ />
        <Footer />
      </div>
    </>
  )
}

export default App


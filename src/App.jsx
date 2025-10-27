import React, { useState } from 'react'
import './styles/nexus.css'
import StarryBackground from './components/StarryBackground'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import Footer from './components/Footer'
import LearnMore from './components/LearnMore'
import RxGuardPrototype from './components/RxGuardPrototype'
import ReguReadyPrototype from './components/ReguReadyPrototype'
import { platformsData } from './data/platformData'

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [showPrototype, setShowPrototype] = useState(null) // 'rxguard' or 'reguready'

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

  // If showing a prototype, render it
  if (showPrototype === 'rxguard') {
    return <RxGuardPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />
  }
  if (showPrototype === 'reguready') {
    return <ReguReadyPrototype onBack={handleBackFromPrototype} onUpgrade={handleUpgrade} />
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
        <Footer />
      </div>
    </>
  )
}

export default App


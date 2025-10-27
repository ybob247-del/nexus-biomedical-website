import React, { useState } from 'react'
import './styles/nexus.css'
import StarryBackground from './components/StarryBackground'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import Footer from './components/Footer'
import LearnMore from './components/LearnMore'
import { platformsData } from './data/platformData'

function App() {
  const [selectedPlatform, setSelectedPlatform] = useState(null)

  const handleLearnMore = (platformName) => {
    setSelectedPlatform(platformsData[platformName])
  }

  const handleBackToHome = () => {
    setSelectedPlatform(null)
  }

  // If a platform is selected, show Learn More page
  if (selectedPlatform) {
    return <LearnMore platform={selectedPlatform} onBack={handleBackToHome} />
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


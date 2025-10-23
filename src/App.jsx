import React from 'react'
import './styles/nexus.css'
import StarryBackground from './components/StarryBackground'
import Hero from './components/Hero'
import Platforms from './components/Platforms'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <StarryBackground />
      <div className="nexus-app">
        <Hero />
        <Platforms />
        <Footer />
      </div>
    </>
  )
}

export default App


import React from 'react'
import StarryBackground from './StarryBackground'
import Header from './Header'
import Footer from './Footer'

export default function PageLayout({ children, showHeader = true, showFooter = true }) {
  return (
    <>
      <StarryBackground />
      {showHeader && <Header />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
      {showFooter && <Footer />}
    </>
  )
}

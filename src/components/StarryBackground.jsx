import React, { useEffect, useRef } from 'react'

export default function StarryBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    let stars = []

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    // Create stars
    const initStars = () => {
      stars = []
      const numStars = Math.floor((canvas.width * canvas.height) / 3000)
      
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.01,
          twinkleDirection: Math.random() > 0.5 ? 1 : -1
        })
      }
    }

    // Animate stars
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(star => {
        // Twinkle effect
        star.opacity += star.twinkleSpeed * star.twinkleDirection
        if (star.opacity >= 1 || star.opacity <= 0.2) {
          star.twinkleDirection *= -1
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Add glow for brighter stars
        if (star.opacity > 0.7) {
          ctx.beginPath()
          ctx.arc(star.x, star.y, star.radius * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 168, 204, ${(star.opacity - 0.7) * 0.3})`
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Initialize
    resizeCanvas()
    animate()

    // Handle resize
    window.addEventListener('resize', resizeCanvas)

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}


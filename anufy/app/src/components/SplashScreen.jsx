"use client"

import { useState, useEffect } from "react"

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true)
  const [animationPhase, setAnimationPhase] = useState("intro") // intro, main, outro
  const [logoRevealed, setLogoRevealed] = useState(false)
  const [textRevealed, setTextRevealed] = useState(false)

  useEffect(() => {
    const timeline = [
      { delay: 500, action: () => setLogoRevealed(true) },
      { delay: 1500, action: () => setTextRevealed(true) },
      { delay: 2000, action: () => setAnimationPhase("main") },
      { delay: 4000, action: () => setAnimationPhase("outro") },
      {
        delay: 4800,
        action: () => {
          setIsVisible(false)
          onComplete()
        },
      },
    ]

    const timers = timeline.map(({ delay, action }) => setTimeout(action, delay))

    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  if (!isVisible) return null

  return (
    <div className={`splash-screen-v2 ${animationPhase}`}>
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="bg-layer layer-1"></div>
        <div className="bg-layer layer-2"></div>
        <div className="bg-layer layer-3"></div>
        <div className="particles-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className={`particle particle-${i % 5}`}></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="splash-content-v2">
        {/* Logo Section */}
        <div className={`logo-section ${logoRevealed ? "revealed" : ""}`}>
          <div className="logo-wrapper">
            <div className="logo-bg-circle"></div>
            <div className="logo-main">
              <div className="logo-letter">
                <span className="letter-a">A</span>
                <div className="letter-glow"></div>
              </div>
              <div className="logo-rings">
                <div className="ring ring-1"></div>
                <div className="ring ring-2"></div>
                <div className="ring ring-3"></div>
              </div>
            </div>
            <div className="logo-pulse"></div>
          </div>
        </div>

        {/* Brand Text */}
        <div className={`brand-section ${textRevealed ? "revealed" : ""}`}>
          <div className="brand-name">
            <div className="letter-container">
              <span className="brand-letter" style={{ "--delay": "0s" }}>
                A
              </span>
              <span className="brand-letter" style={{ "--delay": "0.1s" }}>
                n
              </span>
              <span className="brand-letter" style={{ "--delay": "0.2s" }}>
                u
              </span>
              <span className="brand-letter" style={{ "--delay": "0.3s" }}>
                f
              </span>
              <span className="brand-letter" style={{ "--delay": "0.4s" }}>
                y
              </span>
            </div>
            <div className="brand-underline"></div>
          </div>
          <div className="brand-tagline">
            <div className="tagline-word" style={{ "--delay": "0.6s" }}>
              Connect
            </div>
            <div className="tagline-separator">•</div>
            <div className="tagline-word" style={{ "--delay": "0.8s" }}>
              Share
            </div>
            <div className="tagline-separator">•</div>
            <div className="tagline-word" style={{ "--delay": "1s" }}>
              Vibe
            </div>
          </div>
        </div>

        {/* Loading Section */}
        <div className="loading-section">
          <div className="loading-bar-container">
            <div className="loading-bar">
              <div className="loading-progress"></div>
              <div className="loading-glow"></div>
            </div>
          </div>
          <div className="loading-text">Loading your experience...</div>
        </div>

        {/* Floating Elements */}
        <div className="floating-elements-v2">
          <div className="float-item item-1">
            <div className="icon-circle">💬</div>
          </div>
          <div className="float-item item-2">
            <div className="icon-circle">📸</div>
          </div>
          <div className="float-item item-3">
            <div className="icon-circle">🎮</div>
          </div>
          <div className="float-item item-4">
            <div className="icon-circle">✨</div>
          </div>
          <div className="float-item item-5">
            <div className="icon-circle">🎵</div>
          </div>
          <div className="float-item item-6">
            <div className="icon-circle">🌟</div>
          </div>
        </div>

        {/* Version Badge */}
        <div className="version-badge">
          <div className="badge-content">
            <span className="version-text">v1.0.0</span>
            <div className="badge-glow"></div>
          </div>
        </div>
      </div>

      {/* Screen Transition Effect */}
      <div className="screen-transition">
        <div className="transition-layer"></div>
      </div>
    </div>
  )
}

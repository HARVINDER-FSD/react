"use client"

export default function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="mini-logo">
          <div className="mini-logo-circle">
            <span>A</span>
          </div>
        </div>

        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
        </div>

        <p className="loading-message">{message}</p>
      </div>
    </div>
  )
}

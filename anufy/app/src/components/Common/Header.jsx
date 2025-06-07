"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../features/auth/AuthContext"
import { logoutUser } from "../../services/authService"

export default function Header({ title, showMoodPicker = false, showBackButton = false }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentMood, setCurrentMood] = useState("😊")
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 17) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")
  }, [])

  const handleLogout = async () => {
    try {
      await logoutUser()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const moodOptions = ["😊", "😎", "🥳", "😴", "🤔", "😍", "🤪", "😌"]

  return (
    <header className="app-header">
      <div className="header-left">
        {showBackButton && (
          <button onClick={handleBack} className="back-button">
            ←
          </button>
        )}
        <div className="user-info">
          <div className="user-avatar" style={{ background: `linear-gradient(45deg, #FF6B6B, #4ECDC4)` }}>
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="user-details">
            <h2>{title || `${greeting}, ${user?.username || "User"}!`}</h2>
            {!title && <p>Ready to vibe today?</p>}
          </div>
        </div>
      </div>
      <div className="header-actions">
        {showMoodPicker && (
          <div className="mood-selector">
            <span>Mood:</span>
            <div className="mood-picker">
              {moodOptions.map((mood) => (
                <button
                  key={mood}
                  className={`mood-option ${currentMood === mood ? "active" : ""}`}
                  onClick={() => setCurrentMood(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  )
}

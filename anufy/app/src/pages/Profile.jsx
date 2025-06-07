"use client"

import { useState } from "react"
import { useAuth } from "../features/auth/AuthContext"
import Header from "../components/Common/Header"

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")

  const userStats = {
    posts: 24,
    friends: 156,
    moodStreak: 7,
  }

  const userPosts = [
    {
      id: 1,
      content: "Just had the best day ever at the beach! 🏖️",
      image: "beach",
      likes: 24,
      comments: 5,
      date: "2 days ago",
    },
    {
      id: 2,
      content: "New workout routine is killing me but worth it! 💪",
      image: null,
      likes: 18,
      comments: 3,
      date: "1 week ago",
    },
    {
      id: 3,
      content: "Check out this amazing sunset view from my balcony",
      image: "sunset",
      likes: 42,
      comments: 7,
      date: "2 weeks ago",
    },
  ]

  const moodHistory = [
    { date: "Today", mood: "😊", note: "Feeling great!" },
    { date: "Yesterday", mood: "😎", note: "Productive day" },
    { date: "2 days ago", mood: "🥳", note: "Party time!" },
    { date: "3 days ago", mood: "😌", note: "Relaxed" },
    { date: "4 days ago", mood: "🤔", note: "Contemplative" },
    { date: "5 days ago", mood: "😍", note: "Amazing day" },
    { date: "6 days ago", mood: "😊", note: "Good vibes" },
  ]

  const themes = [
    { id: "default", name: "Default", color: "#667eea" },
    { id: "sunset", name: "Sunset", color: "#ff7e5f" },
    { id: "ocean", name: "Ocean", color: "#0083B0" },
    { id: "forest", name: "Forest", color: "#56ab2f" },
  ]

  const [selectedTheme, setSelectedTheme] = useState("default")

  return (
    <div className="page-container">
      <Header showBackButton={true} />

      <div className="profile-container">
        <div className="profile-header" style={{ background: `linear-gradient(45deg, #667eea, #764ba2)` }}>
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase() || "U"}
            <div className="mood-indicator">😊</div>
          </div>
          <h2 className="profile-name">{user?.username || "User"}</h2>
          <p className="profile-bio">Living life one emoji at a time ✨</p>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{userStats.posts}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.friends}</span>
              <span className="stat-label">Friends</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userStats.moodStreak}</span>
              <span className="stat-label">Streak</span>
            </div>
          </div>

          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`profile-tab ${activeTab === "moods" ? "active" : ""}`}
            onClick={() => setActiveTab("moods")}
          >
            Mood History
          </button>
          <button
            className={`profile-tab ${activeTab === "themes" ? "active" : ""}`}
            onClick={() => setActiveTab("themes")}
          >
            Themes
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "posts" && (
            <div className="profile-posts">
              {userPosts.map((post) => (
                <div key={post.id} className="profile-post-card">
                  <p>{post.content}</p>
                  {post.image && (
                    <div className="post-image">
                      <div className={`placeholder-image ${post.image}`}></div>
                    </div>
                  )}
                  <div className="post-meta">
                    <span>{post.likes} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "moods" && (
            <div className="mood-history">
              <div className="mood-streak">
                <h4>Current Streak: {userStats.moodStreak} days</h4>
                <div className="streak-bar">
                  {moodHistory.map((day, index) => (
                    <div key={index} className="streak-day">
                      <div className="streak-mood">{day.mood}</div>
                      <div className="streak-date">
                        {index === 0 ? "Today" : index === 1 ? "Yest" : index + 1 + "d"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mood-entries">
                {moodHistory.map((entry, index) => (
                  <div key={index} className="mood-entry">
                    <div className="mood-emoji">{entry.mood}</div>
                    <div className="mood-content">
                      <h4>{entry.date}</h4>
                      <p>{entry.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "themes" && (
            <div className="theme-selector">
              <h4>Choose Your Theme</h4>
              <div className="themes-grid">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`theme-option ${selectedTheme === theme.id ? "selected" : ""}`}
                    onClick={() => setSelectedTheme(theme.id)}
                  >
                    <div className="theme-color" style={{ backgroundColor: theme.color }}></div>
                    <span>{theme.name}</span>
                  </div>
                ))}
              </div>

              <div className="vibe-identity">
                <h4>Vibe Identity</h4>
                <div className="emoji-style-picker">
                  <div className="emoji-style active">🎮 Gamer</div>
                  <div className="emoji-style">🎵 Music Lover</div>
                  <div className="emoji-style">🏋️ Fitness</div>
                  <div className="emoji-style">🎨 Creative</div>
                  <div className="emoji-style">✈️ Traveler</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Common/Header"
import { useAuth } from "../features/auth/AuthContext"

// Helper functions for localStorage operations with error handling
const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error)
    return []
  }
}

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error)
  }
}

// Stories management
const getStories = () => {
  const stories = getStoredData("vyb_stories")
  // Filter stories from last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return stories.filter((story) => new Date(story.timestamp) > oneDayAgo)
}

const addStory = (storyData) => {
  const stories = getStoredData("vyb_stories")
  const newStory = {
    id: `story_${Date.now()}`,
    ...storyData,
    timestamp: new Date().toISOString(),
    views: 0,
    likes: 0,
  }
  stories.unshift(newStory)
  setStoredData("vyb_stories", stories)
  return newStory
}

const viewStory = (storyId) => {
  const stories = getStoredData("vyb_stories")
  const storyIndex = stories.findIndex((s) => s.id === storyId)
  if (storyIndex !== -1) {
    stories[storyIndex].views = (stories[storyIndex].views || 0) + 1
    setStoredData("vyb_stories", stories)
  }
}

const addNotification = (notification) => {
  try {
    const notifications = getStoredData("vyb_notifications")
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    }
    notifications.unshift(newNotification)
    if (notifications.length > 50) notifications.splice(50)
    setStoredData("vyb_notifications", notifications)
  } catch (error) {
    console.error("Error adding notification:", error)
  }
}

export default function StoryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stories, setStories] = useState([])
  const [activeStory, setActiveStory] = useState(null)
  const [storyIndex, setStoryIndex] = useState(0)
  const [showCreateStory, setShowCreateStory] = useState(false)
  const [newStoryText, setNewStoryText] = useState("")
  const [selectedMood, setSelectedMood] = useState("😊")

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = () => {
    const allStories = getStories()
    setStories(allStories)
  }

  const handleStoryClick = (story, index) => {
    setActiveStory(story)
    setStoryIndex(index)
    viewStory(story.id)

    // Auto advance after 5 seconds
    setTimeout(() => {
      handleNextStory()
    }, 5000)
  }

  const handleNextStory = () => {
    if (storyIndex < stories.length - 1) {
      const nextStory = stories[storyIndex + 1]
      setActiveStory(nextStory)
      setStoryIndex(storyIndex + 1)
      viewStory(nextStory.id)
    } else {
      setActiveStory(null)
      setStoryIndex(0)
    }
  }

  const handlePrevStory = () => {
    if (storyIndex > 0) {
      const prevStory = stories[storyIndex - 1]
      setActiveStory(prevStory)
      setStoryIndex(storyIndex - 1)
    }
  }

  const handleCreateStory = () => {
    if (!newStoryText.trim() && !selectedMood) return

    const storyData = {
      userId: user.uid,
      username: user.username,
      avatar: user.profilePicture || "👤",
      content: newStoryText,
      mood: selectedMood,
      type: "text",
      backgroundColor: getRandomColor(),
    }

    addStory(storyData)
    setNewStoryText("")
    setSelectedMood("😊")
    setShowCreateStory(false)
    loadStories()

    // Add notification
    addNotification({
      type: "story_created",
      message: "Your story has been posted!",
      userId: user.uid,
    })
  }

  const getRandomColor = () => {
    const colors = [
      "linear-gradient(45deg, #FF6B6B, #4ECDC4)",
      "linear-gradient(45deg, #667eea, #764ba2)",
      "linear-gradient(45deg, #f093fb, #fee140)",
      "linear-gradient(45deg, #4facfe, #00f2fe)",
      "linear-gradient(45deg, #43e97b, #38f9d7)",
      "linear-gradient(45deg, #fa709a, #fee140)",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return `${Math.floor((now - date) / (1000 * 60))}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`
    }
  }

  const moodOptions = ["😊", "😎", "🥳", "😍", "🤩", "😂", "🥰", "😇", "🤔", "😴", "🔥", "💯", "✨", "🌟"]

  if (activeStory) {
    return (
      <div className="story-viewer">
        <div className="story-header">
          <button onClick={() => setActiveStory(null)} className="story-close">
            ✕
          </button>
          <div className="story-progress">
            {stories.map((_, index) => (
              <div key={index} className={`progress-bar ${index <= storyIndex ? "active" : ""}`} />
            ))}
          </div>
          <div className="story-user-info">
            <div className="story-avatar">{activeStory.avatar}</div>
            <div className="story-details">
              <h4>{activeStory.username}</h4>
              <span>{formatTime(activeStory.timestamp)}</span>
            </div>
          </div>
        </div>

        <div className="story-content" style={{ background: activeStory.backgroundColor }} onClick={handleNextStory}>
          <div className="story-navigation">
            <div
              className="nav-area left"
              onClick={(e) => {
                e.stopPropagation()
                handlePrevStory()
              }}
            />
            <div className="nav-area right" onClick={handleNextStory} />
          </div>

          <div className="story-text-content">
            <div className="story-mood">{activeStory.mood}</div>
            <p>{activeStory.content}</p>
          </div>

          <div className="story-stats">
            <span>👁️ {activeStory.views}</span>
            <span>❤️ {activeStory.likes}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header title="Stories" showBackButton={true} />

      <div className="story-container">
        <div className="story-header">
          <h3>Stories</h3>
          <button className="story-filter-btn" onClick={() => setShowCreateStory(true)}>
            Create
          </button>
        </div>

        <div className="your-story">
          <div className="story-create" onClick={() => setShowCreateStory(true)}>
            <div className="story-avatar create">
              <span>+</span>
            </div>
            <p>Create Story</p>
          </div>
        </div>

        <div className="story-list">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className={`story-item ${story.userId === user.uid ? "own-story" : ""}`}
              onClick={() => handleStoryClick(story, index)}
            >
              <div className="story-avatar">
                <span>{story.avatar}</span>
                <div className="story-ring"></div>
              </div>
              <div className="story-info">
                <p className="story-username">{story.username}</p>
                <div className="story-meta">
                  <span className="story-mood">{story.mood}</span>
                  <span className="story-time">{formatTime(story.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="story-categories">
          <h3>Trending</h3>
          <div className="category-list">
            <div className="category-item">
              <span className="category-icon">🎵</span>
              <p>Music</p>
            </div>
            <div className="category-item">
              <span className="category-icon">🎮</span>
              <p>Gaming</p>
            </div>
            <div className="category-item">
              <span className="category-icon">🍔</span>
              <p>Food</p>
            </div>
            <div className="category-item">
              <span className="category-icon">🏞️</span>
              <p>Travel</p>
            </div>
          </div>
        </div>

        <button className="floating-action-btn camera" onClick={() => navigate("/camera")}>
          <span>📸</span>
        </button>

        {/* Create Story Modal */}
        {showCreateStory && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create Story</h3>
                <button onClick={() => setShowCreateStory(false)} className="modal-close">
                  ✕
                </button>
              </div>

              <div className="create-story-form">
                <div className="mood-selector">
                  <h4>Choose your mood:</h4>
                  <div className="mood-grid">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood}
                        className={`mood-option ${selectedMood === mood ? "active" : ""}`}
                        onClick={() => setSelectedMood(mood)}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newStoryText}
                  onChange={(e) => setNewStoryText(e.target.value)}
                  placeholder="What's your story?"
                  className="story-textarea"
                  rows={4}
                />

                <div className="story-preview" style={{ background: getRandomColor() }}>
                  <div className="preview-mood">{selectedMood}</div>
                  <p>{newStoryText || "Your story will appear here..."}</p>
                </div>

                <button onClick={handleCreateStory} className="create-story-btn" disabled={!newStoryText.trim()}>
                  Share Story
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

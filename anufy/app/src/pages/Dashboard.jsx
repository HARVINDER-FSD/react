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

// Dashboard data management
const getNotifications = () => {
  return getStoredData("vyb_notifications")
}

const getStories = () => {
  const stories = getStoredData("vyb_stories")
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return stories.filter((story) => new Date(story.timestamp) > oneDayAgo)
}

const getPosts = () => {
  return getStoredData("vyb_posts")
}

const getChats = () => {
  return getStoredData("vyb_chats")
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, setUserMood } = useAuth()
  const [recentActivity, setRecentActivity] = useState([])
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [selectedMood, setSelectedMood] = useState(user?.currentMood || "😊")
  const [showMoodSelector, setShowMoodSelector] = useState(false)

  useEffect(() => {
    loadDashboardData()

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      loadDashboardData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(refreshInterval)
  }, [user])

  const loadDashboardData = () => {
    if (!user) return

    // Get recent notifications
    const allNotifications = getNotifications()
    const userNotifications = allNotifications.filter((notif) => notif.userId === user.uid)
    setNotifications(userNotifications.slice(0, 5))
    setUnreadCount(userNotifications.filter((notif) => !notif.read).length)

    // Generate activity feed
    generateActivityFeed()
  }

  const generateActivityFeed = () => {
    // Get recent stories
    const stories = getStories().slice(0, 3)

    // Get recent posts
    const posts = getPosts().slice(0, 3)

    // Get recent chats
    const chats = getChats()
      .filter((chat) => chat.participants.some((p) => p.id === user.uid))
      .slice(0, 3)

    // Combine and sort by timestamp
    const combinedActivity = [
      ...stories.map((story) => ({
        type: "story",
        icon: "📸",
        content: `${story.username} posted a story`,
        timestamp: story.timestamp,
        data: story,
      })),
      ...posts.map((post) => ({
        type: "post",
        icon: "📱",
        content: `${post.username} shared a post`,
        timestamp: post.timestamp,
        data: post,
      })),
      ...chats.map((chat) => {
        const otherParticipant = chat.participants.find((p) => p.id !== user.uid)
        return {
          type: "chat",
          icon: "💬",
          content: `New message from ${otherParticipant?.username || "Unknown"}`,
          timestamp: chat.lastMessageTime,
          data: chat,
          unread: chat.unread,
        }
      }),
    ]

    // Sort by timestamp (newest first)
    combinedActivity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    setRecentActivity(combinedActivity.slice(0, 5))
  }

  const handleMoodChange = (mood) => {
    setSelectedMood(mood)
    setShowMoodSelector(false)

    // Update user mood in context and database
    setUserMood(mood)
  }

  const handleActivityClick = (activity) => {
    switch (activity.type) {
      case "story":
        navigate("/stories")
        break
      case "post":
        navigate("/feed")
        break
      case "chat":
        navigate("/chat")
        break
      default:
        break
    }
  }

  const features = [
    {
      id: "chats",
      title: "Chats",
      icon: "💬",
      color: "#FF6B6B",
      path: "/chat",
      items: ["Normal Chat", "Vanish Mode", "Emoji Burst", "Voice + Mood", "Reaction Overlay"],
    },
    {
      id: "friends",
      title: "Friends",
      icon: "👥",
      color: "#4ECDC4",
      path: "/friends",
      items: ["Add from Contacts", "Add by Username", "Scan QR Code"],
    },
    {
      id: "stories",
      title: "Stories",
      icon: "📸",
      color: "#45B7D1",
      path: "/stories",
      items: ["Mood Story", "Filter Camera", "Text & Music Overlays"],
    },
    {
      id: "games",
      title: "Games",
      icon: "🎮",
      color: "#96CEB4",
      path: "/games",
      items: ["Truth or Dare", "Roast Bot", "Mood Battle", "Poll Games"],
    },
    {
      id: "feed",
      title: "Feed",
      icon: "📱",
      color: "#FFEAA7",
      path: "/feed",
      items: ["Emotion Feed", "Emoji Reactions", "Comment System", "Share Content"],
    },
    {
      id: "notes",
      title: "Notes",
      icon: "📝",
      color: "#DDA0DD",
      path: "/notes",
      items: ["Notes Vault", "Mood Diary", "Reminder Notes"],
    },
    {
      id: "camera",
      title: "Camera",
      icon: "📷",
      color: "#FFB6C1",
      path: "/camera",
      items: ["Filter Camera", "Story Composer"],
    },
    {
      id: "profile",
      title: "Profile",
      icon: "👤",
      color: "#87CEEB",
      path: "/profile",
      items: ["Mood Aura", "Vibe Identity", "Profile Themes"],
    },
  ]

  const quickActions = [
    { title: "Start Chat", icon: "💬", color: "#FF6B6B", path: "/chat" },
    { title: "Add Story", icon: "📸", color: "#45B7D1", path: "/stories" },
    { title: "Play Game", icon: "🎮", color: "#96CEB4", path: "/games" },
    { title: "Take Note", icon: "📝", color: "#DDA0DD", path: "/notes" },
  ]

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

  return (
    <div className="dashboard">
      <Header showMoodPicker={true} />

      {/* Current Mood Display */}
      <div className="current-mood-display">
        <div className="mood-display-inner" onClick={() => setShowMoodSelector(true)}>
          <span className="current-mood-emoji">{selectedMood}</span>
          <span className="current-mood-text">Current Mood</span>
        </div>

        {showMoodSelector && (
          <div className="mood-selector-popup">
            <div className="mood-selector-header">
              <h4>How are you feeling?</h4>
              <button onClick={() => setShowMoodSelector(false)} className="close-btn">
                ✕
              </button>
            </div>
            <div className="mood-grid">
              {[
                "😊",
                "😎",
                "🥳",
                "😍",
                "🤩",
                "😂",
                "🥰",
                "😇",
                "🤔",
                "😴",
                "😌",
                "🙃",
                "😏",
                "😬",
                "😪",
                "😢",
                "😡",
                "😱",
              ].map((mood) => (
                <button
                  key={mood}
                  className={`mood-option ${selectedMood === mood ? "active" : ""}`}
                  onClick={() => handleMoodChange(mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="action-card"
              style={{ borderColor: action.color }}
              onClick={() => navigate(action.path)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`activity-item ${activity.unread ? "unread" : ""}`}
                onClick={() => handleActivityClick(activity)}
              >
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-content">
                  <p>
                    <strong>{activity.content}</strong>
                  </p>
                  <span className="activity-time">{formatTime(activity.timestamp)}</span>
                </div>
                {activity.unread && <span className="unread-dot"></span>}
              </div>
            ))
          ) : (
            <div className="empty-activity">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </section>

      {/* Notifications */}
      <section className="notifications-section">
        <div className="section-header">
          <h3>Notifications</h3>
          {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
        </div>
        <div className="notifications-list">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} className={`notification-item ${notification.read ? "" : "unread"}`}>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-time">{formatTime(notification.timestamp)}</span>
                </div>
                {!notification.read && <span className="unread-indicator"></span>}
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <p>No notifications</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <h3>Explore Features</h3>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card" style={{ borderTopColor: feature.color }}>
              <div className="feature-header">
                <span className="feature-icon">{feature.icon}</span>
                <h4>{feature.title}</h4>
              </div>
              <ul className="feature-items">
                {feature.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              <button
                className="feature-btn"
                style={{ backgroundColor: feature.color }}
                onClick={() => navigate(feature.path)}
              >
                Explore {feature.title}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

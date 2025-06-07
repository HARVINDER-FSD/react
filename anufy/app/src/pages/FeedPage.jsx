"use client"

import { useState, useEffect } from "react"
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

// Posts management
const getPosts = () => {
  return getStoredData("vyb_posts")
}

const addPost = (postData) => {
  const posts = getPosts()
  const newPost = {
    id: `post_${Date.now()}`,
    ...postData,
    timestamp: new Date().toISOString(),
    likes: [],
    comments: [],
    reactions: {},
  }
  posts.unshift(newPost)
  setStoredData("vyb_posts", posts)
  return newPost
}

const likePost = (postId, userId) => {
  const posts = getPosts()
  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    if (!posts[postIndex].likes) posts[postIndex].likes = []
    if (posts[postIndex].likes.includes(userId)) {
      posts[postIndex].likes = posts[postIndex].likes.filter((id) => id !== userId)
    } else {
      posts[postIndex].likes.push(userId)
    }
    setStoredData("vyb_posts", posts)
  }
}

const addReaction = (postId, reaction, userId) => {
  const posts = getPosts()
  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    if (!posts[postIndex].reactions) posts[postIndex].reactions = {}
    if (!posts[postIndex].reactions[reaction]) posts[postIndex].reactions[reaction] = []

    const userIndex = posts[postIndex].reactions[reaction].indexOf(userId)
    if (userIndex > -1) {
      posts[postIndex].reactions[reaction].splice(userIndex, 1)
    } else {
      posts[postIndex].reactions[reaction].push(userId)
    }

    setStoredData("vyb_posts", posts)
  }
}

const addComment = (postId, comment) => {
  const posts = getPosts()
  const postIndex = posts.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    if (!posts[postIndex].comments) posts[postIndex].comments = []
    const newComment = {
      id: `comment_${Date.now()}`,
      ...comment,
      timestamp: new Date().toISOString(),
    }
    posts[postIndex].comments.push(newComment)
    setStoredData("vyb_posts", posts)
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

export default function FeedPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("trending")
  const [posts, setPosts] = useState([])
  const [newPostContent, setNewPostContent] = useState("")
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [commentInputs, setCommentInputs] = useState({})

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    const allPosts = getPosts()
    setPosts(allPosts)
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return

    const newPost = {
      userId: user.uid,
      username: user.username,
      avatar: user.profilePicture || "👤",
      content: newPostContent,
      mood: user.currentMood || "😊",
    }

    addPost(newPost)
    setNewPostContent("")
    setShowCreatePost(false)
    loadPosts()

    // Add notification
    addNotification({
      type: "post_created",
      message: "Your post has been shared!",
      userId: user.uid,
    })
  }

  const handleReaction = (postId, reaction) => {
    addReaction(postId, reaction, user.uid)
    loadPosts()
  }

  const handleLike = (postId) => {
    likePost(postId, user.uid)
    loadPosts()
  }

  const handleComment = (postId) => {
    const commentText = commentInputs[postId]
    if (!commentText?.trim()) return

    const comment = {
      userId: user.uid,
      username: user.username,
      avatar: user.profilePicture || "👤",
      content: commentText,
    }

    addComment(postId, comment)
    setCommentInputs({ ...commentInputs, [postId]: "" })
    loadPosts()
  }

  const updateCommentInput = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value })
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
      return date.toLocaleDateString()
    }
  }

  const getReactionCount = (reactions, reaction) => {
    return reactions?.[reaction]?.length || 0
  }

  const hasUserReacted = (reactions, reaction) => {
    return reactions?.[reaction]?.includes(user.uid) || false
  }

  return (
    <div className="page-container">
      <Header title="Feed" showBackButton={true} />

      <div className="feed-container">
        <div className="feed-tabs">
          <button
            className={`feed-tab ${activeTab === "trending" ? "active" : ""}`}
            onClick={() => setActiveTab("trending")}
          >
            Trending
          </button>
          <button
            className={`feed-tab ${activeTab === "following" ? "active" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button className={`feed-tab ${activeTab === "moods" ? "active" : ""}`} onClick={() => setActiveTab("moods")}>
            Moods
          </button>
        </div>

        {/* Create Post Section */}
        <div className="create-post-section">
          <div className="create-post-trigger" onClick={() => setShowCreatePost(true)}>
            <div className="user-avatar-small">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
            <div className="create-post-placeholder">What's on your mind, {user?.username}?</div>
          </div>
        </div>

        <div className="feed-list">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-user">
                  <div className="post-avatar">{post.avatar}</div>
                  <div className="post-user-info">
                    <h4>{post.username}</h4>
                    <span className="post-time">{formatTime(post.timestamp)}</span>
                  </div>
                </div>
                <div className="post-mood">{post.mood}</div>
              </div>

              <div className="post-content">
                <p>{post.content}</p>
                {post.image && (
                  <div className="post-image">
                    <div className={`placeholder-image ${post.image}`}></div>
                  </div>
                )}
              </div>

              <div className="post-actions">
                <div className="reaction-buttons">
                  {["👍", "❤️", "😂", "😮", "😢", "😡"].map((reaction) => (
                    <button
                      key={reaction}
                      onClick={() => handleReaction(post.id, reaction)}
                      className={hasUserReacted(post.reactions, reaction) ? "active-reaction" : ""}
                    >
                      {reaction}
                      {getReactionCount(post.reactions, reaction) > 0 && (
                        <span className="reaction-count">{getReactionCount(post.reactions, reaction)}</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="post-stats">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`like-button ${post.likes?.includes(user.uid) ? "liked" : ""}`}
                  >
                    ❤️ {post.likes?.length || 0} likes
                  </button>
                  <span>{post.comments?.length || 0} comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="comments-section">
                {post.comments?.slice(-2).map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-avatar">{comment.avatar}</div>
                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>{comment.username}</strong>
                        <span className="comment-time">{formatTime(comment.timestamp)}</span>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  </div>
                ))}

                {post.comments?.length > 2 && (
                  <button className="view-more-comments">View all {post.comments.length} comments</button>
                )}
              </div>

              <div className="post-comment-input">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => updateCommentInput(post.id, e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleComment(post.id)}
                />
                <button onClick={() => handleComment(post.id)}>Send</button>
              </div>
            </div>
          ))}
        </div>

        <button className="floating-action-btn" onClick={() => setShowCreatePost(true)}>
          <span>+</span>
        </button>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create Post</h3>
                <button onClick={() => setShowCreatePost(false)} className="modal-close">
                  ✕
                </button>
              </div>

              <div className="create-post-form">
                <div className="post-user-info">
                  <div className="user-avatar-small">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
                  <div>
                    <strong>{user?.username}</strong>
                    <div className="mood-display">Feeling {user?.currentMood || "😊"}</div>
                  </div>
                </div>

                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's happening?"
                  className="post-textarea"
                  rows={4}
                />

                <div className="post-actions-row">
                  <button onClick={handleCreatePost} className="post-button" disabled={!newPostContent.trim()}>
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

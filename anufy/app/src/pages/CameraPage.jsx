"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
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

// Camera data management
const saveStory = async (storyData) => {
  try {
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

    // Update user's story count
    const users = getStoredData("vyb_users")
    const userIndex = users.findIndex((u) => u.uid === storyData.userId)
    if (userIndex !== -1) {
      users[userIndex].storiesCount = (users[userIndex].storiesCount || 0) + 1
      setStoredData("vyb_users", users)
    }

    return newStory
  } catch (error) {
    console.error("Error saving story:", error)
    throw error
  }
}

const saveToGallery = async (userId, mediaData) => {
  try {
    const gallery = getStoredData(`vyb_gallery_${userId}`)
    const newMedia = {
      id: `media_${Date.now()}`,
      ...mediaData,
      timestamp: new Date().toISOString(),
    }
    gallery.unshift(newMedia)
    setStoredData(`vyb_gallery_${userId}`, gallery)
    return newMedia
  } catch (error) {
    console.error("Error saving to gallery:", error)
    throw error
  }
}

export default function CameraPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("camera")
  const [activeFilter, setActiveFilter] = useState("normal")
  const [capturedImage, setCapturedImage] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode] = useState("user") // "user" for front, "environment" for back
  const [flashMode, setFlashMode] = useState("off")
  const [selectedEmojis, setSelectedEmojis] = useState([])
  const [textOverlay, setTextOverlay] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  const filters = [
    { id: "normal", name: "Normal", icon: "🔍", filter: "none" },
    { id: "vintage", name: "Vintage", icon: "🕰️", filter: "sepia(0.8) contrast(1.2)" },
    { id: "blur", name: "Blur", icon: "💫", filter: "blur(2px)" },
    { id: "grayscale", name: "B&W", icon: "⚫", filter: "grayscale(1)" },
    { id: "sepia", name: "Sepia", icon: "🟤", filter: "sepia(1)" },
    { id: "invert", name: "Invert", icon: "🔄", filter: "invert(1)" },
    { id: "saturate", name: "Vivid", icon: "🌈", filter: "saturate(2)" },
    { id: "contrast", name: "Drama", icon: "⚡", filter: "contrast(1.5)" },
  ]

  const emojis = ["😊", "😎", "🥳", "😍", "🤩", "😂", "🥰", "😇", "🤔", "😴", "🔥", "💯", "✨", "❤️", "👑", "🎉"]

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setCameraError(null)

      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: activeTab === "video",
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (error) {
      console.error("Camera access error:", error)
      setCameraError("Camera access denied or not available")
    }
  }, [facingMode, activeTab])

  // Initialize camera on mount and when settings change
  useEffect(() => {
    if (!capturedImage) {
      initializeCamera()
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [initializeCamera, capturedImage])

  // Apply filters to video
  useEffect(() => {
    if (videoRef.current) {
      const currentFilter = filters.find((f) => f.id === activeFilter)
      videoRef.current.style.filter = currentFilter?.filter || "none"
    }
  }, [activeFilter, filters])

  // Capture photo
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Apply filter and draw video frame
    context.filter = filters.find((f) => f.id === activeFilter)?.filter || "none"
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Add emoji overlays
    selectedEmojis.forEach((emoji) => {
      context.font = "48px Arial"
      context.fillText(emoji.emoji, emoji.x, emoji.y)
    })

    // Add text overlay
    if (textOverlay) {
      context.font = "32px Arial"
      context.fillStyle = "white"
      context.strokeStyle = "black"
      context.lineWidth = 2
      context.textAlign = "center"
      context.strokeText(textOverlay, canvas.width / 2, canvas.height - 50)
      context.fillText(textOverlay, canvas.width / 2, canvas.height - 50)
    }

    // Convert to image
    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9)
    setCapturedImage(imageDataUrl)

    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }
  }, [activeFilter, filters, selectedEmojis, textOverlay])

  // Start video recording
  const startRecording = useCallback(() => {
    if (!streamRef.current) return

    recordedChunksRef.current = []
    const mediaRecorder = new MediaRecorder(streamRef.current)
    mediaRecorderRef.current = mediaRecorder

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" })
      const videoUrl = URL.createObjectURL(blob)
      setCapturedImage(videoUrl)
    }

    mediaRecorder.start()
    setIsRecording(true)
  }, [])

  // Stop video recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  // Handle video recording
  const handleVideoCapture = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  // Flip camera
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
  }

  // Toggle flash (for supported devices)
  const handleFlashToggle = async () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0]
      const capabilities = track.getCapabilities()

      if (capabilities.torch) {
        const newFlashMode = flashMode === "off" ? "on" : "off"
        await track.applyConstraints({
          advanced: [{ torch: newFlashMode === "on" }],
        })
        setFlashMode(newFlashMode)
      }
    }
  }

  // Add emoji to image
  const handleEmojiAdd = (emoji) => {
    if (capturedImage) {
      const newEmoji = {
        emoji,
        x: Math.random() * 200 + 100,
        y: Math.random() * 200 + 100,
        id: Date.now(),
      }
      setSelectedEmojis((prev) => [...prev, newEmoji])
    }
  }

  // Remove emoji
  const handleEmojiRemove = (emojiId) => {
    setSelectedEmojis((prev) => prev.filter((e) => e.id !== emojiId))
  }

  // Retake photo/video
  const handleRetake = () => {
    setCapturedImage(null)
    setSelectedEmojis([])
    setTextOverlay("")
    setShowTextInput(false)
    initializeCamera()
  }

  // Save and post
  const handlePost = async () => {
    if (!capturedImage) return

    try {
      // Save to stories
      const storyData = {
        id: Date.now().toString(),
        userId: user.uid,
        username: user.username,
        imageUrl: capturedImage,
        timestamp: new Date().toISOString(),
        filter: activeFilter,
        emojis: selectedEmojis,
        text: textOverlay,
        type: activeTab === "video" ? "video" : "photo",
      }

      await saveStory(storyData)

      // Also save to user's gallery
      await saveToGallery(user.uid, storyData)

      navigate("/stories")
    } catch (error) {
      console.error("Failed to post:", error)
    }
  }

  // Download image
  const handleDownload = () => {
    if (!capturedImage) return

    const link = document.createElement("a")
    link.download = `vyb-photo-${Date.now()}.jpg`
    link.href = capturedImage
    link.click()
  }

  const handleBack = () => {
    if (capturedImage) {
      handleRetake()
    } else {
      navigate(-1)
    }
  }

  if (cameraError) {
    return (
      <div className="camera-page">
        <div className="camera-error">
          <h2>Camera Access Required</h2>
          <p>{cameraError}</p>
          <button onClick={initializeCamera} className="retry-btn">
            Try Again
          </button>
          <button onClick={() => navigate(-1)} className="back-btn">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="camera-page">
      <div className="camera-container">
        {/* Camera View */}
        <div className={`camera-view ${capturedImage ? "captured" : ""}`}>
          {!capturedImage ? (
            <>
              <video ref={videoRef} className="camera-video" autoPlay playsInline muted />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </>
          ) : (
            <div className="captured-media">
              {activeTab === "video" && capturedImage.startsWith("blob:") ? (
                <video src={capturedImage} controls className="captured-video" />
              ) : (
                <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="captured-image" />
              )}

              {/* Emoji overlays */}
              {selectedEmojis.map((emoji) => (
                <div
                  key={emoji.id}
                  className="emoji-overlay-item"
                  style={{ left: emoji.x, top: emoji.y }}
                  onClick={() => handleEmojiRemove(emoji.id)}
                >
                  {emoji.emoji}
                </div>
              ))}

              {/* Text overlay */}
              {textOverlay && <div className="text-overlay">{textOverlay}</div>}
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className="camera-controls">
          {!capturedImage ? (
            <>
              <button className="camera-btn back" onClick={handleBack}>
                ←
              </button>

              <button className="camera-btn flash" onClick={handleFlashToggle}>
                {flashMode === "on" ? "⚡" : "🔦"}
              </button>

              <button
                className={`camera-btn capture ${isRecording ? "recording" : ""}`}
                onClick={activeTab === "video" ? handleVideoCapture : handleCapture}
              >
                <div className="capture-inner">
                  {activeTab === "video" && isRecording && <div className="recording-indicator" />}
                </div>
              </button>

              <button className="camera-btn flip" onClick={handleFlipCamera}>
                🔄
              </button>
            </>
          ) : (
            <>
              <button className="camera-btn back" onClick={handleRetake}>
                ←
              </button>
              <button className="camera-btn download" onClick={handleDownload}>
                ⬇️
              </button>
              <button className="camera-btn text" onClick={() => setShowTextInput(true)}>
                Aa
              </button>
              <button className="camera-btn post" onClick={handlePost}>
                Post
              </button>
            </>
          )}
        </div>

        {/* Filters */}
        {!capturedImage && (
          <div className="camera-filters">
            <div className="filters-scroll">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  className={`filter-option ${activeFilter === filter.id ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  <span className="filter-icon">{filter.icon}</span>
                  <span className="filter-name">{filter.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Emoji Overlay */}
        {capturedImage && (
          <div className="emoji-overlay">
            <div className="emoji-scroll">
              {emojis.map((emoji, index) => (
                <button key={index} className="emoji-option" onClick={() => handleEmojiAdd(emoji)}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Input Modal */}
        {showTextInput && (
          <div className="text-input-modal">
            <div className="text-input-content">
              <input
                type="text"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
                placeholder="Add text..."
                className="text-input"
                autoFocus
              />
              <div className="text-input-actions">
                <button onClick={() => setShowTextInput(false)}>Cancel</button>
                <button onClick={() => setShowTextInput(false)}>Done</button>
              </div>
            </div>
          </div>
        )}

        {/* Camera Tabs */}
        <div className="camera-tabs">
          <button
            className={`camera-tab ${activeTab === "camera" ? "active" : ""}`}
            onClick={() => setActiveTab("camera")}
          >
            Photo
          </button>
          <button
            className={`camera-tab ${activeTab === "video" ? "active" : ""}`}
            onClick={() => setActiveTab("video")}
          >
            Video
          </button>
          <button
            className={`camera-tab ${activeTab === "boomerang" ? "active" : ""}`}
            onClick={() => setActiveTab("boomerang")}
          >
            Boomerang
          </button>
        </div>
      </div>
    </div>
  )
}

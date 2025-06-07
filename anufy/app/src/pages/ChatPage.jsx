"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Common/Header"
import { useAuth } from "../features/auth/AuthContext"

export default function ChatPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("chats")
  const [searchQuery, setSearchQuery] = useState("")
  const [chats, setChats] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [typingTimeout, setTypingTimeout] = useState(null)
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState(null)
  const messagesEndRef = useRef(null)
  const messageInputRef = useRef(null)

  // Local data management functions
  const getStoredData = (key) => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]")
    } catch {
      return []
    }
  }

  const setStoredData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  }

  const initializeChatData = () => {
    if (!localStorage.getItem("vyb_chats")) {
      localStorage.setItem("vyb_chats", JSON.stringify([]))
    }
  }

  const getChats = () => {
    return getStoredData("vyb_chats")
  }

  const addMessage = (chatId, message) => {
    const chats = getChats()
    const chatIndex = chats.findIndex((chat) => chat.id === chatId)
    const timestamp = new Date().toISOString()

    if (chatIndex !== -1) {
      chats[chatIndex].messages.push({
        id: Date.now(),
        ...message,
        timestamp,
      })
      chats[chatIndex].lastMessage = message.content
      chats[chatIndex].lastMessageTime = timestamp
      chats[chatIndex].unread = message.senderId !== user?.uid
    } else {
      // Create new chat
      const newChatId = `chat_${Date.now()}`
      chats.push({
        id: newChatId,
        participants: message.participants || [],
        messages: [
          {
            id: Date.now(),
            ...message,
            timestamp,
          },
        ],
        lastMessage: message.content,
        lastMessageTime: timestamp,
        type: "individual",
        unread: message.senderId !== user?.uid,
      })
    }

    setStoredData("vyb_chats", chats)
    return chats
  }

  const createChat = (participants, type = "individual") => {
    const chats = getChats()
    const chatId = `chat_${Date.now()}`
    const newChat = {
      id: chatId,
      participants,
      messages: [],
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      type,
      createdAt: new Date().toISOString(),
      unread: false,
    }

    chats.push(newChat)
    setStoredData("vyb_chats", chats)
    return newChat
  }

  const markChatAsRead = (chatId, userId) => {
    const chats = getChats()
    const chatIndex = chats.findIndex((chat) => chat.id === chatId)

    if (chatIndex !== -1) {
      chats[chatIndex].unread = false
      chats[chatIndex].lastReadBy = userId
      chats[chatIndex].lastReadAt = new Date().toISOString()
      setStoredData("vyb_chats", chats)
    }
  }

  const searchUsers = (query) => {
    // Mock search results - in real app, this would be an API call
    const mockUsers = [
      { id: "user1", username: "alex_j", name: "Alex Johnson", avatar: "👨", isOnline: true },
      { id: "user2", username: "sarah_w", name: "Sarah Williams", avatar: "👩", isOnline: true },
      { id: "user3", username: "mike_t", name: "Mike Thompson", avatar: "👦", isOnline: false },
      { id: "user4", username: "jessica_m", name: "Jessica Miller", avatar: "👧", isOnline: false },
      { id: "user5", username: "david_k", name: "David Kim", avatar: "🧔", isOnline: true },
      { id: "user6", username: "emma_w", name: "Emma Wilson", avatar: "👱‍♀️", isOnline: true },
      { id: "user7", username: "james_b", name: "James Brown", avatar: "👨‍🦰", isOnline: false },
      { id: "user8", username: "olivia_d", name: "Olivia Davis", avatar: "👩‍🦱", isOnline: true },
    ]

    if (!query || query.trim() === "") {
      return mockUsers
    }

    return mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.name.toLowerCase().includes(query.toLowerCase()),
    )
  }

  useEffect(() => {
    initializeChatData()
    loadChats()

    // Initialize demo chat if no chats exist
    const existingChats = getChats()
    if (existingChats.length === 0 && user) {
      // Create welcome chat with VYB Assistant
      const welcomeChat = createChat([
        { id: user.uid, username: user.username || "You", avatar: user.profilePicture || "👤" },
        { id: "vyb_assistant", username: "VYB Assistant", avatar: "🤖" },
      ])

      // Add welcome message
      addMessage(welcomeChat.id, {
        content: "Welcome to VYB Chat! 🎉 Start connecting with friends and discover amazing conversations!",
        senderId: "vyb_assistant",
        senderName: "VYB Assistant",
        senderAvatar: "🤖",
        participants: welcomeChat.participants,
      })

      loadChats()
    }

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      if (!selectedChat) {
        loadChats()
      }
    }, 10000) // Refresh every 10 seconds when not in a chat

    return () => clearInterval(refreshInterval)
  }, [user])

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  useEffect(() => {
    // Mark chat as read when selected
    if (selectedChat && user) {
      markChatAsRead(selectedChat.id, user.uid)
      // Simulate typing indicators for demo
      simulateTypingIndicators()
    }
  }, [selectedChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadChats = () => {
    if (!user) return

    const allChats = getChats()
    // Filter chats where current user is a participant
    const userChats = allChats.filter((chat) => chat.participants.some((p) => p.id === user.uid))

    // Sort by last message time
    userChats.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))

    setChats(userChats)

    // If we have a selected chat, update it
    if (selectedChat) {
      const updatedChat = userChats.find((chat) => chat.id === selectedChat.id)
      if (updatedChat) {
        setSelectedChat(updatedChat)
      }
    }
  }

  const simulateTypingIndicators = () => {
    // Only for demo chats with system or demo users
    if (selectedChat && selectedChat.participants.some((p) => p.id === "vyb_assistant" || p.id.startsWith("demo_"))) {
      // Random chance of showing typing indicator
      if (Math.random() > 0.7) {
        setTimeout(
          () => {
            setIsTyping(true)

            // Clear typing after random time
            setTimeout(
              () => {
                setIsTyping(false)

                // Random chance of sending a response
                if (Math.random() > 0.5) {
                  const otherParticipant = selectedChat.participants.find((p) => p.id !== user.uid)

                  const responses = [
                    "Hey there! How's your day going? 😊",
                    "That's really interesting! Tell me more!",
                    "I was just thinking about that too! 🤔",
                    "What are you up to today?",
                    "Have you tried the new camera features? 📸",
                    "I love using VYB app! It's so fun! 🎉",
                    "Did you see the latest stories? They're amazing!",
                    "Let's catch up soon! I miss our chats 💬",
                    "Hope you're having a great time! ✨",
                    "The weather is perfect today, isn't it? ☀️",
                  ]

                  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

                  const message = {
                    content: randomResponse,
                    senderId: otherParticipant.id,
                    senderName: otherParticipant.username,
                    senderAvatar: otherParticipant.avatar,
                    participants: selectedChat.participants,
                  }

                  addMessage(selectedChat.id, message)
                  loadChats()
                }
              },
              1000 + Math.random() * 3000,
            )
          },
          1000 + Math.random() * 2000,
        )
      }
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedEmoji) return

    let content = newMessage.trim()

    // Add emoji if selected
    if (selectedEmoji) {
      content = content ? `${content} ${selectedEmoji}` : selectedEmoji
    }

    const message = {
      content,
      senderId: user.uid,
      senderName: user.username || user.displayName || "You",
      senderAvatar: user.profilePicture || "👤",
      participants: selectedChat.participants,
    }

    addMessage(selectedChat.id, message)
    setNewMessage("")
    setSelectedEmoji(null)
    setEmojiPickerVisible(false)
    loadChats()

    // Focus back on input
    messageInputRef.current?.focus()

    // Simulate typing response
    simulateTypingIndicators()
  }

  const handleCreateChat = (targetUser) => {
    const participants = [
      { id: user.uid, username: user.username || user.displayName || "You", avatar: user.profilePicture || "👤" },
      { id: targetUser.id, username: targetUser.username, avatar: targetUser.avatar },
    ]

    const newChat = createChat(participants)
    setSelectedChat(newChat)
    setShowNewChatModal(false)
    loadChats()
  }

  const handleSearchUsers = (query) => {
    if (query.trim()) {
      const results = searchUsers(query)
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleInputChange = (e) => {
    setNewMessage(e.target.value)

    // Clear previous timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout for typing indicator
    const timeout = setTimeout(() => {
      // In a real app, this would send a typing indicator to the server
      console.log("User stopped typing")
    }, 1000)

    setTypingTimeout(timeout)
  }

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji)
    setEmojiPickerVisible(false)
    messageInputRef.current?.focus()
  }

  const filteredChats = chats.filter((chat) => {
    const otherParticipant = chat.participants.find((p) => p.id !== user?.uid)
    return otherParticipant?.username.toLowerCase().includes(searchQuery.toLowerCase())
  })

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

  const getGroupedMessages = (messages) => {
    if (!messages || messages.length === 0) return []

    const groupedMessages = []
    let currentGroup = {
      senderId: messages[0].senderId,
      messages: [messages[0]],
    }

    for (let i = 1; i < messages.length; i++) {
      const message = messages[i]

      // If same sender and within 5 minutes, group together
      if (
        message.senderId === currentGroup.senderId &&
        new Date(message.timestamp) - new Date(currentGroup.messages[currentGroup.messages.length - 1].timestamp) <
          5 * 60 * 1000
      ) {
        currentGroup.messages.push(message)
      } else {
        // Start a new group
        groupedMessages.push(currentGroup)
        currentGroup = {
          senderId: message.senderId,
          messages: [message],
        }
      }
    }

    // Add the last group
    groupedMessages.push(currentGroup)

    return groupedMessages
  }

  if (!user) {
    return (
      <div className="page-container">
        <Header title="Chats" showBackButton={true} />
        <div className="empty-state">
          <p>Please log in to access chats</p>
        </div>
      </div>
    )
  }

  if (selectedChat) {
    const otherParticipant = selectedChat.participants.find((p) => p.id !== user?.uid)
    const groupedMessages = getGroupedMessages(selectedChat.messages || [])

    return (
      <div className="page-container">
        <Header
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setSelectedChat(null)}
                style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer" }}
              >
                ←
              </button>
              <span>{otherParticipant?.username || "Chat"}</span>
              <span style={{ fontSize: "16px" }}>{otherParticipant?.avatar}</span>
            </div>
          }
        />

        <div className="chat-conversation">
          <div className="messages-container">
            {groupedMessages.map((group, groupIndex) => {
              const isCurrentUser = group.senderId === user.uid
              const sender = selectedChat.participants.find((p) => p.id === group.senderId)

              return (
                <div key={groupIndex} className={`message-group ${isCurrentUser ? "sent" : "received"}`}>
                  {!isCurrentUser && <div className="message-avatar">{sender?.avatar || "👤"}</div>}

                  <div className="message-bubble-group">
                    {group.messages.map((message, msgIndex) => (
                      <div key={message.id} className={`message ${isCurrentUser ? "sent" : "received"}`}>
                        <div className="message-content">
                          <p>{message.content}</p>
                          {msgIndex === group.messages.length - 1 && (
                            <span className="message-time">{formatTime(message.timestamp)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {isTyping && (
              <div className="message-group received">
                <div className="message-avatar">{otherParticipant?.avatar || "👤"}</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="message-input-container">
            {emojiPickerVisible && (
              <div className="emoji-picker">
                <div className="emoji-picker-header">
                  <h4>Select Emoji</h4>
                  <button onClick={() => setEmojiPickerVisible(false)} className="close-btn">
                    ✕
                  </button>
                </div>
                <div className="emoji-grid">
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
                    "👍",
                    "❤️",
                    "🔥",
                    "🎉",
                    "👏",
                    "🙏",
                    "🤗",
                    "💯",
                  ].map((emoji) => (
                    <button key={emoji} className="emoji-option" onClick={() => handleEmojiSelect(emoji)}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button className="emoji-button" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}>
              😊
            </button>

            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder={selectedEmoji ? `Message with ${selectedEmoji}` : "Type a message..."}
              className="message-input"
              ref={messageInputRef}
            />

            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Header title="Chats" showBackButton={true} />

      <div className="chat-container">
        <div className="chat-tabs">
          <button className={`chat-tab ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>
            All Chats
          </button>
          <button
            className={`chat-tab ${activeTab === "groups" ? "active" : ""}`}
            onClick={() => setActiveTab("groups")}
          >
            Groups
          </button>
          <button
            className={`chat-tab ${activeTab === "vanish" ? "active" : ""}`}
            onClick={() => setActiveTab("vanish")}
          >
            Vanish Mode
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="chat-list">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => {
              const otherParticipant = chat.participants.find((p) => p.id !== user?.uid)
              const lastMessage = chat.messages?.[chat.messages.length - 1]

              return (
                <div
                  key={chat.id}
                  className={`chat-item ${chat.unread ? "unread" : ""}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-avatar">
                    <span>{otherParticipant?.avatar || "👤"}</span>
                    <span className={`online-indicator ${Math.random() > 0.5 ? "active" : ""}`}></span>
                  </div>
                  <div className="chat-content">
                    <div className="chat-header">
                      <h4>{otherParticipant?.username || "Unknown"}</h4>
                      <span className="chat-time">{chat.lastMessageTime ? formatTime(chat.lastMessageTime) : ""}</span>
                    </div>
                    <p className="chat-message">
                      {lastMessage?.senderId === user.uid && <span className="you-prefix">You: </span>}
                      {lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                  {chat.unread && <span className="unread-badge">{Math.floor(Math.random() * 5) + 1}</span>}
                </div>
              )
            })
          ) : (
            <div className="empty-state">
              <p>No chats found</p>
              <button onClick={() => setShowNewChatModal(true)} className="start-chat-btn">
                Start a new chat
              </button>
            </div>
          )}
        </div>

        <button className="floating-action-btn" onClick={() => setShowNewChatModal(true)}>
          <span>+</span>
        </button>

        {/* New Chat Modal */}
        {showNewChatModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Start New Chat</h3>
                <button onClick={() => setShowNewChatModal(false)} className="modal-close">
                  ✕
                </button>
              </div>

              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search users..."
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="user-search-results">
                {searchResults.map((user) => (
                  <div key={user.id} className="user-search-item" onClick={() => handleCreateChat(user)}>
                    <div className="user-avatar">
                      <span>{user.avatar}</span>
                      {user.isOnline && <span className="online-indicator active"></span>}
                    </div>
                    <div className="user-info">
                      <h4>{user.name}</h4>
                      <p>@{user.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Header from "../components/Common/Header"

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("friends")
  const [searchQuery, setSearchQuery] = useState("")

  const friends = [
    {
      id: 1,
      name: "Alex Johnson",
      username: "alex_j",
      avatar: "👨",
      isOnline: true,
      mood: "😊",
    },
    {
      id: 2,
      name: "Sarah Williams",
      username: "sarah_w",
      avatar: "👩",
      isOnline: true,
      mood: "🥳",
    },
    {
      id: 3,
      name: "Mike Thompson",
      username: "mike_t",
      avatar: "👦",
      isOnline: false,
      mood: "😴",
    },
    {
      id: 4,
      name: "Jessica Miller",
      username: "jessica_m",
      avatar: "👧",
      isOnline: false,
      mood: "🤔",
    },
    {
      id: 5,
      name: "David Kim",
      username: "david_k",
      avatar: "🧔",
      isOnline: true,
      mood: "😎",
    },
  ]

  const requests = [
    {
      id: 101,
      name: "Emma Wilson",
      username: "emma_w",
      avatar: "👱‍♀️",
      mutualFriends: 3,
    },
    {
      id: 102,
      name: "James Brown",
      username: "james_b",
      avatar: "👨‍🦰",
      mutualFriends: 1,
    },
  ]

  const suggestions = [
    {
      id: 201,
      name: "Olivia Davis",
      username: "olivia_d",
      avatar: "👩‍🦱",
      mutualFriends: 5,
    },
    {
      id: 202,
      name: "Noah Wilson",
      username: "noah_w",
      avatar: "👨‍🦱",
      mutualFriends: 2,
    },
    {
      id: 203,
      name: "Sophia Martinez",
      username: "sophia_m",
      avatar: "👩‍🦰",
      mutualFriends: 4,
    },
  ]

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="page-container">
      <Header title="Friends" showBackButton={true} />

      <div className="friends-container">
        <div className="friends-tabs">
          <button
            className={`friends-tab ${activeTab === "friends" ? "active" : ""}`}
            onClick={() => setActiveTab("friends")}
          >
            Friends
          </button>
          <button
            className={`friends-tab ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            Requests
            {requests.length > 0 && <span className="badge">{requests.length}</span>}
          </button>
          <button
            className={`friends-tab ${activeTab === "suggestions" ? "active" : ""}`}
            onClick={() => setActiveTab("suggestions")}
          >
            Suggestions
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {activeTab === "friends" && (
          <div className="friends-list">
            {filteredFriends.length > 0 ? (
              filteredFriends.map((friend) => (
                <div key={friend.id} className="friend-item">
                  <div className="friend-avatar">
                    <span>{friend.avatar}</span>
                    {friend.isOnline && <span className="online-indicator"></span>}
                  </div>
                  <div className="friend-info">
                    <h4>{friend.name}</h4>
                    <p>@{friend.username}</p>
                  </div>
                  <div className="friend-mood">{friend.mood}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No friends found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "requests" && (
          <div className="requests-list">
            {requests.map((request) => (
              <div key={request.id} className="request-item">
                <div className="request-avatar">{request.avatar}</div>
                <div className="request-info">
                  <h4>{request.name}</h4>
                  <p>@{request.username}</p>
                  <span className="mutual-friends">{request.mutualFriends} mutual friends</span>
                </div>
                <div className="request-actions">
                  <button className="accept-btn">Accept</button>
                  <button className="decline-btn">Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "suggestions" && (
          <div className="suggestions-list">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="suggestion-item">
                <div className="suggestion-avatar">{suggestion.avatar}</div>
                <div className="suggestion-info">
                  <h4>{suggestion.name}</h4>
                  <p>@{suggestion.username}</p>
                  <span className="mutual-friends">{suggestion.mutualFriends} mutual friends</span>
                </div>
                <button className="add-friend-btn">Add</button>
              </div>
            ))}
          </div>
        )}

        <div className="add-methods">
          <h3>Add Friends</h3>
          <div className="add-methods-grid">
            <div className="add-method-card">
              <div className="add-method-icon">👤</div>
              <h4>Username</h4>
              <p>Search by username</p>
            </div>
            <div className="add-method-card">
              <div className="add-method-icon">📱</div>
              <h4>Contacts</h4>
              <p>Find friends from contacts</p>
            </div>
            <div className="add-method-card">
              <div className="add-method-icon">📷</div>
              <h4>QR Code</h4>
              <p>Scan friend's QR code</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

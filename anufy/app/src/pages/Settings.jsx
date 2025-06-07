"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Common/Header"
import { useAuth } from "../features/auth/AuthContext"

export default function Settings() {
  const navigate = useNavigate()
  const { user, updateUserProfile, updateUserPreferences, userPreferences, clearUserData } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    email: user?.email || "",
  })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const success = await updateUserProfile(profileData)
      if (success) {
        setMessage("Profile updated successfully!")
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Profile update failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferenceChange = async (key, value) => {
    try {
      await updateUserPreferences({ [key]: value })
      setMessage("Settings updated!")
      setTimeout(() => setMessage(""), 2000)
    } catch (error) {
      console.error("Preference update failed:", error)
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      if (window.confirm("This will permanently delete all your data. Are you absolutely sure?")) {
        try {
          await clearUserData()
          navigate("/")
        } catch (error) {
          console.error("Account deletion failed:", error)
        }
      }
    }
  }

  const handleLogout = async () => {
    try {
      await clearUserData()
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="page-container">
      <Header title="Settings" showBackButton={true} />

      <div className="settings-container" style={{ padding: "20px" }}>
        <div
          className="settings-tabs"
          style={{
            display: "flex",
            background: "white",
            borderRadius: "12px",
            padding: "5px",
            marginBottom: "20px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            className={`settings-tab ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            style={{
              flex: 1,
              background: activeTab === "profile" ? "#667eea" : "none",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              color: activeTab === "profile" ? "white" : "#666",
              transition: "all 0.2s ease",
            }}
          >
            Profile
          </button>
          <button
            className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`}
            onClick={() => setActiveTab("preferences")}
            style={{
              flex: 1,
              background: activeTab === "preferences" ? "#667eea" : "none",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              color: activeTab === "preferences" ? "white" : "#666",
              transition: "all 0.2s ease",
            }}
          >
            Preferences
          </button>
          <button
            className={`settings-tab ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}
            style={{
              flex: 1,
              background: activeTab === "privacy" ? "#667eea" : "none",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              color: activeTab === "privacy" ? "white" : "#666",
              transition: "all 0.2s ease",
            }}
          >
            Privacy
          </button>
        </div>

        {message && (
          <div className="success-message" style={{ marginBottom: "20px" }}>
            {message}
          </div>
        )}

        {activeTab === "profile" && (
          <div
            className="settings-section"
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Profile Information</h3>

            <form onSubmit={handleProfileUpdate}>
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "2px solid #e1e5e9",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    resize: "vertical",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "preferences" && (
          <div
            className="settings-section"
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>App Preferences</h3>

            <div
              className="preference-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Notifications</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Receive push notifications</p>
              </div>
              <label
                className="switch"
                style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}
              >
                <input
                  type="checkbox"
                  checked={userPreferences.notifications}
                  onChange={(e) => handlePreferenceChange("notifications", e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: userPreferences.notifications ? "#667eea" : "#ccc",
                    transition: "0.4s",
                    borderRadius: "24px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: "",
                      height: "18px",
                      width: "18px",
                      left: userPreferences.notifications ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>

            <div
              className="preference-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Sound Effects</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Play sounds for interactions</p>
              </div>
              <label
                className="switch"
                style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}
              >
                <input
                  type="checkbox"
                  checked={userPreferences.soundEnabled}
                  onChange={(e) => handlePreferenceChange("soundEnabled", e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: userPreferences.soundEnabled ? "#667eea" : "#ccc",
                    transition: "0.4s",
                    borderRadius: "24px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: "",
                      height: "18px",
                      width: "18px",
                      left: userPreferences.soundEnabled ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>

            <div
              className="preference-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Auto-save Stories</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Automatically save stories to gallery</p>
              </div>
              <label
                className="switch"
                style={{ position: "relative", display: "inline-block", width: "50px", height: "24px" }}
              >
                <input
                  type="checkbox"
                  checked={userPreferences.autoSaveStories}
                  onChange={(e) => handlePreferenceChange("autoSaveStories", e.target.checked)}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span
                  style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: userPreferences.autoSaveStories ? "#667eea" : "#ccc",
                    transition: "0.4s",
                    borderRadius: "24px",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      content: "",
                      height: "18px",
                      width: "18px",
                      left: userPreferences.autoSaveStories ? "26px" : "3px",
                      bottom: "3px",
                      backgroundColor: "white",
                      transition: "0.4s",
                      borderRadius: "50%",
                    }}
                  ></span>
                </span>
              </label>
            </div>

            <div
              className="preference-item"
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 0" }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Camera Quality</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Choose camera resolution</p>
              </div>
              <select
                value={userPreferences.cameraQuality}
                onChange={(e) => handlePreferenceChange("cameraQuality", e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "6px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div
            className="settings-section"
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Privacy & Security</h3>

            <div
              className="preference-item"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 0",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div>
                <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>Profile Visibility</h4>
                <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>Who can see your profile</p>
              </div>
              <select
                value={userPreferences.privacy}
                onChange={(e) => handlePreferenceChange("privacy", e.target.value)}
                style={{
                  padding: "8px 12px",
                  border: "2px solid #e1e5e9",
                  borderRadius: "6px",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <option value="public">Everyone</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div
              className="danger-zone"
              style={{
                marginTop: "40px",
                padding: "20px",
                border: "2px solid #ff4757",
                borderRadius: "8px",
                background: "#fff5f5",
              }}
            >
              <h4 style={{ margin: "0 0 15px 0", color: "#ff4757" }}>Danger Zone</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "#f44336",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Logout
                </button>

                <button
                  onClick={handleDeleteAccount}
                  style={{
                    background: "#d32f2f",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

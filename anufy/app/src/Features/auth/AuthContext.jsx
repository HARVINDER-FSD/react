"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { onAuthStateChanged, updateProfile } from "firebase/auth"
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore"
import { auth, db } from "../../services/firebase"

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper functions for localStorage operations
const initializeAppData = () => {
  const dataKeys = [
    "vyb_chats",
    "vyb_stories",
    "vyb_posts",
    "vyb_friends",
    "vyb_notes",
    "vyb_games",
    "vyb_notifications",
    "vyb_user_moods",
    "vyb_user_activity",
  ]

  dataKeys.forEach((key) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]))
    }
  })
}

const addUserActivity = (userId, activityType, details) => {
  if (!userId) return

  try {
    const activities = JSON.parse(localStorage.getItem("vyb_user_activity") || "[]")
    const newActivity = {
      id: `activity_${Date.now()}`,
      userId,
      type: activityType,
      details,
      timestamp: new Date().toISOString(),
    }

    activities.unshift(newActivity)

    // Keep only last 100 activities per user
    const userActivities = activities.filter((activity) => activity.userId === userId)
    if (userActivities.length > 100) {
      const toRemove = userActivities.slice(100).map((a) => a.id)
      const filteredActivities = activities.filter((a) => !toRemove.includes(a.id))
      localStorage.setItem("vyb_user_activity", JSON.stringify(filteredActivities))
    } else {
      localStorage.setItem("vyb_user_activity", JSON.stringify(activities))
    }
  } catch (error) {
    console.error("Error adding user activity:", error)
  }
}

const addNotification = (notification) => {
  try {
    const notifications = JSON.parse(localStorage.getItem("vyb_notifications") || "[]")
    const newNotification = {
      id: `notif_${Date.now()}`,
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    }

    notifications.unshift(newNotification)
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.splice(50)
    }

    localStorage.setItem("vyb_notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("Error adding notification:", error)
  }
}

const initializeUserData = (userId) => {
  // Add welcome notification for new users
  const notifications = JSON.parse(localStorage.getItem("vyb_notifications") || "[]")
  const hasWelcomeNotif = notifications.some((n) => n.type === "welcome" && n.userId === userId)

  if (!hasWelcomeNotif) {
    addNotification({
      type: "welcome",
      message: "Welcome to VYB! Start by updating your profile and adding your first story.",
      userId: userId,
    })
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [userPreferences, setUserPreferences] = useState({
    theme: "default",
    notifications: true,
    privacy: "friends",
    language: "en",
    autoSaveStories: true,
    cameraQuality: "high",
    soundEnabled: true,
    vibrationEnabled: true,
  })

  // Refs for cleanup
  const userDocUnsubscribe = useRef(null)
  const activityInterval = useRef(null)

  // Initialize app data and user session
  useEffect(() => {
    if (!localStorage.getItem("vyb_initialized")) {
      initializeAppData()
      localStorage.setItem("vyb_initialized", "true")
    }

    // Set up online/offline listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Main auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      setError(null)

      if (firebaseUser) {
        try {
          await initializeUser(firebaseUser)
        } catch (error) {
          console.error("Error initializing user:", error)
          setError("Failed to load user data. Please try again.")
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
            currentMood: "😊",
            isOnline: true,
          })
        }
      } else {
        await cleanupUserSession()
      }
      setLoading(false)
    })

    return () => {
      unsubscribe()
      cleanupUserSession()
    }
  }, [])

  // Initialize user data and set up real-time listeners
  const initializeUser = async (firebaseUser) => {
    try {
      // Get user document from Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid)
      const userDoc = await getDoc(userDocRef)
      let userData = userDoc.exists() ? userDoc.data() : null

      // If user doesn't exist in Firestore, create initial profile
      if (!userData) {
        userData = await createInitialUserProfile(firebaseUser)
      }

      // Set up real-time listener for user document
      userDocUnsubscribe.current = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          const updatedData = doc.data()
          setUser((prevUser) => ({
            ...prevUser,
            ...updatedData,
            isOnline: true,
          }))
          setUserPreferences(updatedData.preferences || userPreferences)
        }
      })

      // Merge Firebase user with Firestore data
      const fullUserData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        username: firebaseUser.displayName || userData.username || firebaseUser.email.split("@")[0],
        profilePicture: firebaseUser.photoURL || userData.profilePicture,
        currentMood: userData.currentMood || "😊",
        bio: userData.bio || "Living life one emoji at a time ✨",
        isOnline: true,
        lastActive: new Date().toISOString(),
        ...userData,
      }

      setUser(fullUserData)
      setUserPreferences(userData.preferences || userPreferences)

      // Update last active timestamp
      await updateDoc(userDocRef, {
        lastActive: new Date().toISOString(),
        isOnline: true,
      })

      // Initialize user-specific data
      initializeUserData(firebaseUser.uid)

      // Set up activity tracking
      setupActivityTracking(firebaseUser.uid)

      // Load cached user data for offline support
      saveCachedUserData(fullUserData)
    } catch (error) {
      console.error("Error in initializeUser:", error)
      throw error
    }
  }

  // Create initial user profile in Firestore
  const createInitialUserProfile = async (firebaseUser) => {
    const initialUserData = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      username: firebaseUser.displayName || firebaseUser.email.split("@")[0],
      createdAt: new Date().toISOString(),
      profilePicture: firebaseUser.photoURL || null,
      bio: "Living life one emoji at a time ✨",
      currentMood: "😊",
      lastActive: new Date().toISOString(),
      isOnline: true,
      friends: [],
      friendRequests: [],
      preferences: userPreferences,
      stats: {
        storiesCount: 0,
        postsCount: 0,
        friendsCount: 0,
        notesCount: 0,
        gamesPlayed: 0,
      },
      privacy: {
        profileVisibility: "public",
        storyVisibility: "friends",
        lastSeenVisibility: "friends",
        allowFriendRequests: true,
      },
    }

    await setDoc(doc(db, "users", firebaseUser.uid), initialUserData)
    return initialUserData
  }

  // Set up activity tracking
  const setupActivityTracking = (userId) => {
    // Clear any existing interval
    if (activityInterval.current) {
      clearInterval(activityInterval.current)
    }

    // Update user activity every 30 seconds
    activityInterval.current = setInterval(async () => {
      if (isOnline && user) {
        try {
          await updateDoc(doc(db, "users", userId), {
            lastActive: new Date().toISOString(),
            isOnline: true,
          })
        } catch (error) {
          console.error("Error updating activity:", error)
        }
      }
    }, 30000)

    // Update activity on page visibility change
    const handleVisibilityChange = async () => {
      if (!document.hidden && isOnline && user) {
        try {
          await updateDoc(doc(db, "users", userId), {
            lastActive: new Date().toISOString(),
            isOnline: true,
          })
        } catch (error) {
          console.error("Error updating visibility activity:", error)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }

  // Save user data to localStorage for offline support
  const saveCachedUserData = (userData) => {
    try {
      localStorage.setItem(
        "vyb_user_data",
        JSON.stringify({
          ...userData,
          lastCached: new Date().toISOString(),
        }),
      )
    } catch (error) {
      console.error("Error caching user data:", error)
    }
  }

  // Load cached user data for offline support
  const loadCachedUserData = () => {
    try {
      const cachedData = localStorage.getItem("vyb_user_data")
      if (cachedData) {
        const userData = JSON.parse(cachedData)
        // Only use cached data if it's less than 24 hours old
        const cacheAge = new Date() - new Date(userData.lastCached)
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return { ...userData, isOnline: false }
        }
      }
    } catch (error) {
      console.error("Error loading cached user data:", error)
    }
    return null
  }

  // Cleanup user session
  const cleanupUserSession = async () => {
    // Unsubscribe from real-time listeners
    if (userDocUnsubscribe.current) {
      userDocUnsubscribe.current()
      userDocUnsubscribe.current = null
    }

    // Clear activity tracking
    if (activityInterval.current) {
      clearInterval(activityInterval.current)
      activityInterval.current = null
    }

    // Update user status to offline if we have a user
    if (user && isOnline) {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          isOnline: false,
          lastActive: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Error updating offline status:", error)
      }
    }

    // Clear user state
    setUser(null)
    setError(null)

    // Clear cached data
    localStorage.removeItem("vyb_user_data")
  }

  // Update user profile
  const updateUserProfile = useCallback(
    async (updates) => {
      if (!user) {
        setError("No user logged in")
        return false
      }

      try {
        setError(null)
        const updatedUser = { ...user, ...updates }

        // Update local state immediately for better UX
        setUser(updatedUser)

        // Update Firebase Auth profile if needed
        if (updates.username && updates.username !== user.username) {
          await updateProfile(auth.currentUser, {
            displayName: updates.username,
          })
        }

        // Update Firestore
        await updateDoc(doc(db, "users", user.uid), {
          ...updates,
          updatedAt: new Date().toISOString(),
        })

        // Update cached data
        saveCachedUserData(updatedUser)

        // Add to activity log
        addUserActivity(user.uid, "profile_updated", {
          fields: Object.keys(updates),
        })

        return true
      } catch (error) {
        console.error("Error updating profile:", error)
        setError("Failed to update profile. Please try again.")
        // Revert local state on error
        setUser(user)
        return false
      }
    },
    [user],
  )

  // Set user mood
  const setUserMood = useCallback(
    async (mood) => {
      if (!user) {
        setError("No user logged in")
        return false
      }

      try {
        setError(null)
        const moodUpdate = {
          currentMood: mood,
          lastMoodUpdate: new Date().toISOString(),
        }

        // Update local state immediately
        const updatedUser = { ...user, ...moodUpdate }
        setUser(updatedUser)

        // Update Firestore
        await updateDoc(doc(db, "users", user.uid), moodUpdate)

        // Add to mood history
        const newMoodEntry = {
          id: Date.now(),
          userId: user.uid,
          date: new Date().toISOString(),
          mood: mood,
          note: "",
          timestamp: new Date().toISOString(),
        }

        const allMoods = JSON.parse(localStorage.getItem("vyb_user_moods") || "[]")
        allMoods.unshift(newMoodEntry)
        // Keep only last 100 mood entries
        if (allMoods.length > 100) {
          allMoods.splice(100)
        }
        localStorage.setItem("vyb_user_moods", JSON.stringify(allMoods))

        // Add to activity log
        addUserActivity(user.uid, "mood_updated", { mood })

        // Add notification
        addNotification({
          type: "mood_updated",
          message: `Your mood has been updated to ${mood}`,
          userId: user.uid,
        })

        return true
      } catch (error) {
        console.error("Error updating mood:", error)
        setError("Failed to update mood. Please try again.")
        return false
      }
    },
    [user],
  )

  // Update user preferences
  const updateUserPreferences = useCallback(
    async (preferences) => {
      if (!user) {
        setError("No user logged in")
        return false
      }

      try {
        setError(null)
        const newPreferences = { ...userPreferences, ...preferences }
        setUserPreferences(newPreferences)

        // Update Firestore
        await updateDoc(doc(db, "users", user.uid), {
          preferences: newPreferences,
          updatedAt: new Date().toISOString(),
        })

        // Add to activity log
        addUserActivity(user.uid, "preferences_updated", {
          changes: Object.keys(preferences),
        })

        return true
      } catch (error) {
        console.error("Error updating preferences:", error)
        setError("Failed to update preferences. Please try again.")
        return false
      }
    },
    [user, userPreferences],
  )

  // Update user stats
  const updateUserStats = useCallback(
    async (statUpdates) => {
      if (!user) return false

      try {
        const currentStats = user.stats || {}
        const newStats = { ...currentStats, ...statUpdates }

        const updatedUser = { ...user, stats: newStats }
        setUser(updatedUser)

        // Update Firestore
        await updateDoc(doc(db, "users", user.uid), {
          stats: newStats,
          updatedAt: new Date().toISOString(),
        })

        return true
      } catch (error) {
        console.error("Error updating stats:", error)
        return false
      }
    },
    [user],
  )

  // Get user mood history
  const getUserMoodHistory = useCallback(() => {
    try {
      const moods = JSON.parse(localStorage.getItem("vyb_user_moods") || "[]")
      return moods.filter((mood) => mood.userId === user?.uid)
    } catch (error) {
      console.error("Error getting mood history:", error)
      return []
    }
  }, [user])

  // Clear all user data (for logout or account deletion)
  const clearUserData = useCallback(async () => {
    try {
      // Clear localStorage
      const keysToRemove = [
        "vyb_user_data",
        "vyb_user_moods",
        "vyb_chats",
        "vyb_stories",
        "vyb_posts",
        "vyb_friends",
        "vyb_notes",
        "vyb_games",
        "vyb_notifications",
        "vyb_user_activity",
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })

      // Reset state
      setUser(null)
      setUserPreferences({
        theme: "default",
        notifications: true,
        privacy: "friends",
        language: "en",
        autoSaveStories: true,
        cameraQuality: "high",
        soundEnabled: true,
        vibrationEnabled: true,
      })
      setError(null)

      return true
    } catch (error) {
      console.error("Error clearing user data:", error)
      return false
    }
  }, [])

  // Handle offline mode
  useEffect(() => {
    if (!isOnline && !user && !loading) {
      // Try to load cached user data when offline
      const cachedUser = loadCachedUserData()
      if (cachedUser) {
        setUser(cachedUser)
        setUserPreferences(cachedUser.preferences || userPreferences)
      }
    }
  }, [isOnline, user, loading])

  // Context value
  const value = {
    // User state
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isOnline,
    userPreferences,

    // User actions
    updateUserProfile,
    setUserMood,
    updateUserPreferences,
    updateUserStats,
    clearUserData,

    // Utility functions
    getUserMoodHistory,

    // Error handling
    clearError: () => setError(null),

    // User stats helpers
    incrementStat: (statName) => {
      if (user?.stats) {
        updateUserStats({
          [statName]: (user.stats[statName] || 0) + 1,
        })
      }
    },

    // Quick actions
    addStoryCount: () => updateUserStats({ storiesCount: (user?.stats?.storiesCount || 0) + 1 }),
    addPostCount: () => updateUserStats({ postsCount: (user?.stats?.postsCount || 0) + 1 }),
    addFriendCount: () => updateUserStats({ friendsCount: (user?.stats?.friendsCount || 0) + 1 }),
    addNoteCount: () => updateUserStats({ notesCount: (user?.stats?.notesCount || 0) + 1 }),
    addGameCount: () => updateUserStats({ gamesPlayed: (user?.stats?.gamesPlayed || 0) + 1 }),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

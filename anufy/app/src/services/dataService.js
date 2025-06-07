// src/services/dataService.js

// Helper function to get stored data from localStorage
const getStoredData = (key) => {
  try {
    const serializedData = localStorage.getItem(key)
    return serializedData ? JSON.parse(serializedData) : null
  } catch (error) {
    console.error(`Error getting data for key ${key}:`, error)
    return null
  }
}

// Add these functions to the existing dataService.js

// Save story to stories collection
export const saveStory = async (storyData) => {
  try {
    const stories = getStoredData("stories") || []
    stories.unshift(storyData) // Add to beginning
    localStorage.setItem("stories", JSON.stringify(stories))

    // Also update user's story count
    const users = getStoredData("users") || []
    const userIndex = users.findIndex((u) => u.uid === storyData.userId)
    if (userIndex !== -1) {
      users[userIndex].storiesCount = (users[userIndex].storiesCount || 0) + 1
      localStorage.setItem("users", JSON.stringify(users))
    }

    return storyData
  } catch (error) {
    console.error("Error saving story:", error)
    throw error
  }
}

// Save to user's personal gallery
export const saveToGallery = async (userId, mediaData) => {
  try {
    const gallery = getStoredData(`gallery_${userId}`) || []
    gallery.unshift(mediaData)
    localStorage.setItem(`gallery_${userId}`, JSON.stringify(gallery))
    return mediaData
  } catch (error) {
    console.error("Error saving to gallery:", error)
    throw error
  }
}

// Get user's gallery
export const getUserGallery = (userId) => {
  return getStoredData(`gallery_${userId}`) || []
}

// Get all stories
export const getAllStories = () => {
  const stories = getStoredData("stories") || []
  // Filter stories from last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
  return stories.filter((story) => new Date(story.timestamp) > oneDayAgo)
}

// Delete story
export const deleteStory = (storyId, userId) => {
  try {
    const stories = getStoredData("stories") || []
    const updatedStories = stories.filter((story) => !(story.id === storyId && story.userId === userId))
    localStorage.setItem("stories", JSON.stringify(updatedStories))
    return true
  } catch (error) {
    console.error("Error deleting story:", error)
    return false
  }
}

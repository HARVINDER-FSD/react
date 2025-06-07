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

// Notes management
const getNotes = () => {
  return getStoredData("vyb_notes")
}

const addNote = (noteData) => {
  const notes = getNotes()
  const newNote = {
    id: `note_${Date.now()}`,
    ...noteData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  notes.unshift(newNote)
  setStoredData("vyb_notes", notes)
  return newNote
}

const updateNote = (noteId, updateData) => {
  const notes = getNotes()
  const noteIndex = notes.findIndex((n) => n.id === noteId)
  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    }
    setStoredData("vyb_notes", notes)
  }
}

const deleteNote = (noteId) => {
  const notes = getNotes()
  const filteredNotes = notes.filter((n) => n.id !== noteId)
  setStoredData("vyb_notes", filteredNotes)
}

export default function NotesPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("notes")
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState([])
  const [moodEntries, setMoodEntries] = useState([])
  const [reminders, setReminders] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    tag: "Personal",
    emoji: "📝",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const allNotes = getNotes().filter((note) => note.userId === user.uid)
    setNotes(allNotes)

    // Load mood entries from user data
    const userMoods = JSON.parse(localStorage.getItem("vyb_user_moods") || "[]")
    setMoodEntries(userMoods.filter((mood) => mood.userId === user.uid))

    // Load reminders
    const userReminders = JSON.parse(localStorage.getItem("vyb_reminders") || "[]")
    setReminders(userReminders.filter((reminder) => reminder.userId === user.uid))
  }

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const noteData = {
      ...newNote,
      userId: user.uid,
      username: user.username,
    }

    if (editingNote) {
      updateNote(editingNote.id, noteData)
    } else {
      addNote(noteData)
    }

    setNewNote({ title: "", content: "", tag: "Personal", emoji: "📝" })
    setEditingNote(null)
    setShowCreateModal(false)
    loadData()
  }

  const handleEditNote = (note) => {
    setNewNote({
      title: note.title,
      content: note.content,
      tag: note.tag,
      emoji: note.emoji,
    })
    setEditingNote(note)
    setShowCreateModal(true)
  }

  const handleDeleteNote = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(noteId)
      loadData()
    }
  }

  const addMoodEntry = () => {
    const moodText = prompt("How are you feeling today?")
    if (!moodText) return

    const mood = prompt("Pick a mood emoji:", "😊")
    if (!mood) return

    const newMoodEntry = {
      id: Date.now(),
      userId: user.uid,
      date: new Date().toISOString(),
      mood: mood,
      note: moodText,
      timestamp: new Date().toISOString(),
    }

    const allMoods = JSON.parse(localStorage.getItem("vyb_user_moods") || "[]")
    allMoods.unshift(newMoodEntry)
    localStorage.setItem("vyb_user_moods", JSON.stringify(allMoods))
    loadData()
  }

  const addReminder = () => {
    const title = prompt("Reminder title:")
    if (!title) return

    const dateStr = prompt('Date and time (e.g., "Tomorrow, 6:00 PM"):')
    if (!dateStr) return

    const emoji = prompt("Pick an emoji:", "⏰")

    const newReminder = {
      id: Date.now(),
      userId: user.uid,
      title: title,
      date: dateStr,
      emoji: emoji || "⏰",
      completed: false,
      timestamp: new Date().toISOString(),
    }

    const allReminders = JSON.parse(localStorage.getItem("vyb_reminders") || "[]")
    allReminders.unshift(newReminder)
    localStorage.setItem("vyb_reminders", JSON.stringify(allReminders))
    loadData()
  }

  const toggleReminder = (reminderId) => {
    const allReminders = JSON.parse(localStorage.getItem("vyb_reminders") || "[]")
    const reminderIndex = allReminders.findIndex((r) => r.id === reminderId)

    if (reminderIndex !== -1) {
      allReminders[reminderIndex].completed = !allReminders[reminderIndex].completed
      localStorage.setItem("vyb_reminders", JSON.stringify(allReminders))
      loadData()
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const getCreateButtonHandler = () => {
    switch (activeTab) {
      case "notes":
        return () => setShowCreateModal(true)
      case "mood":
        return addMoodEntry
      case "reminders":
        return addReminder
      default:
        return () => setShowCreateModal(true)
    }
  }

  return (
    <div className="page-container">
      <Header title="Notes" showBackButton={true} />

      <div className="notes-container">
        <div className="notes-tabs">
          <button
            className={`notes-tab ${activeTab === "notes" ? "active" : ""}`}
            onClick={() => setActiveTab("notes")}
          >
            Notes
          </button>
          <button className={`notes-tab ${activeTab === "mood" ? "active" : ""}`} onClick={() => setActiveTab("mood")}>
            Mood Diary
          </button>
          <button
            className={`notes-tab ${activeTab === "reminders" ? "active" : ""}`}
            onClick={() => setActiveTab("reminders")}
          >
            Reminders
          </button>
        </div>

        {activeTab === "notes" && (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        )}

        <div className="notes-list">
          {activeTab === "notes" &&
            filteredNotes.map((note) => (
              <div key={note.id} className="note-card" onClick={() => handleEditNote(note)}>
                <div className="note-emoji">{note.emoji}</div>
                <div className="note-content">
                  <h4>{note.title}</h4>
                  <p>{note.content}</p>
                  <div className="note-meta">
                    <span className="note-date">{formatDate(note.createdAt)}</span>
                    <span className="note-tag">{note.tag}</span>
                  </div>
                </div>
                <button
                  className="note-delete"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteNote(note.id)
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}

          {activeTab === "mood" &&
            moodEntries.map((entry) => (
              <div key={entry.id} className="mood-entry">
                <div className="mood-emoji">{entry.mood}</div>
                <div className="mood-content">
                  <h4>{formatDate(entry.date)}</h4>
                  <p>{entry.note}</p>
                </div>
              </div>
            ))}

          {activeTab === "reminders" &&
            reminders.map((reminder) => (
              <div key={reminder.id} className={`reminder-card ${reminder.completed ? "completed" : ""}`}>
                <div className="reminder-emoji">{reminder.emoji}</div>
                <div className="reminder-content">
                  <h4 style={{ textDecoration: reminder.completed ? "line-through" : "none" }}>{reminder.title}</h4>
                  <p>{reminder.date}</p>
                </div>
                <button className="reminder-check" onClick={() => toggleReminder(reminder.id)}>
                  {reminder.completed ? "✓" : "○"}
                </button>
              </div>
            ))}

          {/* Empty states */}
          {activeTab === "notes" && filteredNotes.length === 0 && (
            <div className="empty-state">
              <p>No notes found</p>
              <button onClick={() => setShowCreateModal(true)} className="start-chat-btn">
                Create your first note
              </button>
            </div>
          )}

          {activeTab === "mood" && moodEntries.length === 0 && (
            <div className="empty-state">
              <p>No mood entries yet</p>
              <button onClick={addMoodEntry} className="start-chat-btn">
                Add your first mood
              </button>
            </div>
          )}

          {activeTab === "reminders" && reminders.length === 0 && (
            <div className="empty-state">
              <p>No reminders set</p>
              <button onClick={addReminder} className="start-chat-btn">
                Create your first reminder
              </button>
            </div>
          )}
        </div>

        <button className="floating-action-btn" onClick={getCreateButtonHandler()}>
          <span>+</span>
        </button>

        {/* Create/Edit Note Modal */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingNote ? "Edit Note" : "Create Note"}</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingNote(null)
                    setNewNote({ title: "", content: "", tag: "Personal", emoji: "📝" })
                  }}
                  className="modal-close"
                >
                  ✕
                </button>
              </div>

              <div className="create-note-form">
                <div className="form-row">
                  <input
                    type="text"
                    value={newNote.emoji}
                    onChange={(e) => setNewNote({ ...newNote, emoji: e.target.value })}
                    className="emoji-input"
                    placeholder="📝"
                  />
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Note title..."
                    className="title-input"
                  />
                </div>

                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  placeholder="Write your note here..."
                  className="content-textarea"
                  rows={8}
                />

                <div className="form-row">
                  <select
                    value={newNote.tag}
                    onChange={(e) => setNewNote({ ...newNote, tag: e.target.value })}
                    className="tag-select"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Ideas">Ideas</option>
                  </select>

                  <button
                    onClick={handleCreateNote}
                    className="save-note-btn"
                    disabled={!newNote.title.trim() || !newNote.content.trim()}
                  >
                    {editingNote ? "Update" : "Save"} Note
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

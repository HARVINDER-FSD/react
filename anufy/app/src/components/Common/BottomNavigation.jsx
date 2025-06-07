"use client"

import { useLocation, useNavigate } from "react-router-dom"

export default function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const navItems = [
    { path: "/dashboard", icon: "🏠", label: "Home" },
    { path: "/chat", icon: "💬", label: "Chats" },
    { path: "/stories", icon: "📸", label: "Stories" },
    { path: "/friends", icon: "👥", label: "Friends" },
    { path: "/profile", icon: "👤", label: "Profile" },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`nav-item ${currentPath === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

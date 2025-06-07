"use client"

import { useState } from "react"
import { AuthProvider } from "./features/auth/AuthContext"
import AppRoutes from "./routes/AppRoutes"
import SplashScreen from "./components/SplashScreen"
import "./index.css"
import "./components/SplashScreen.css"

function App() {
  const [showSplash, setShowSplash] = useState(true)

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  return (
    <AuthProvider>
      <div className="App">{showSplash ? <SplashScreen onComplete={handleSplashComplete} /> : <AppRoutes />}</div>
    </AuthProvider>
  )
}

export default App

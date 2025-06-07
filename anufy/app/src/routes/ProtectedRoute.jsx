"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../features/auth/AuthContext"
import BottomNavigation from "../components/Common/BottomNavigation"
import LoadingScreen from "../components/LoadingScreen"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen message="Authenticating..." />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <>
      {children}
      <BottomNavigation />
    </>
  )
}

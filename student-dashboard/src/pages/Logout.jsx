"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../lib/firebase"
import { signOut } from "firebase/auth"

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    // Sign out the user and redirect to login page
    const handleLogout = async () => {
      try {
        await signOut(auth)
        navigate("/login")
      } catch (error) {
        console.error("Logout error:", error)
        navigate("/login")
      }
    }

    handleLogout()
  }, [navigate])

  return (
    <div className="loading-screen">
      <p>Logging out...</p>
    </div>
  )
}

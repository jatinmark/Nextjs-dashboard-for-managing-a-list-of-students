"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import "../styles/auth.css"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      // Create new user with Firebase
      await createUserWithEmailAndPassword(auth, email, password)
      // Redirect to dashboard on success
      navigate("/")
    } catch (error) {
      // Handle registration errors
      console.error("Registration error:", error)
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create an account</h2>
          <p className="auth-description">Enter your details to create an account</p>
        </div>
        <form onSubmit={handleRegister}>
          <div className="auth-content">
            {error && <div className="auth-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>
          <div className="auth-footer">
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
            </button>
            <div className="auth-link">
              <span>Already have an account? </span>
              <a onClick={() => navigate("/login")}>Login</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

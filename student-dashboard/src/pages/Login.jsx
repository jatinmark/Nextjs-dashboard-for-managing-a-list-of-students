"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../lib/firebase"
import "../styles/auth.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Attempt to sign in with Firebase
      await signInWithEmailAndPassword(auth, email, password)
      // Redirect to dashboard on success
      navigate("/")
    } catch (error) {
      // Handle login errors
      console.error("Login error:", error)
      setError("Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Login</h2>
          <p className="auth-description">Enter your credentials to access the student dashboard</p>
        </div>
        <form onSubmit={handleLogin}>
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
          </div>
          <div className="auth-footer">
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="auth-link">
              <span>Don't have an account? </span>
              <a onClick={() => navigate("/register")}>Register</a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

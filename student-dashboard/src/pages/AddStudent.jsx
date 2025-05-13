"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import "../styles/auth.css"

export default function AddStudent() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [course, setCourse] = useState("")
  const [courses, setCourses] = useState(["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const navigate = useNavigate()

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setAuthChecking(false)

      // Redirect to login if not authenticated
      if (!currentUser) {
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  // Validate form fields
  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!course) {
      newErrors.course = "Course is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Create new student via API
      await axios.post("/api/students", {
        name,
        email,
        course,
        enrollmentDate: new Date().toISOString().split("T")[0],
      })

      // Redirect to dashboard on success
      navigate("/")
    } catch (error) {
      console.error("Error adding student:", error)
      setErrors({ submit: "Failed to add student. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  if (authChecking) {
    return <div className="loading-screen">Checking authentication...</div>
  }

  if (!user) {
    return <div className="loading-screen">Redirecting to login...</div>
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Add New Student</h2>
          <p className="auth-description">Enter student details to add them to the system</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="auth-content">
            {errors.submit && <div className="auth-error">{errors.submit}</div>}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="course" className="form-label">
                Course
              </label>
              <select id="course" value={course} onChange={(e) => setCourse(e.target.value)} className="form-select">
                <option value="" disabled>
                  Select a course
                </option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.course && <p className="form-error">{errors.course}</p>}
            </div>
          </div>
          <div className="auth-footer" style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate("/")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import "../styles/student-details.css"

export default function StudentDetails() {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [authChecking, setAuthChecking] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

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

  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!user) return

      try {
        const response = await axios.get(`/api/students/${id}`)
        setStudent(response.data)
      } catch (error) {
        console.error("Error fetching student details:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchStudentDetails()
    }
  }, [id, user])

  if (authChecking) {
    return <div className="loading-screen">Checking authentication...</div>
  }

  if (!user) {
    return <div className="loading-screen">Redirecting to login...</div>
  }

  if (loading) {
    return <div className="loading-screen">Loading student details...</div>
  }

  if (!student) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Student Not Found</h2>
            <p className="auth-description">The student you are looking for does not exist</p>
          </div>
          <div className="auth-footer">
            <button className="btn btn-primary" onClick={() => navigate("/")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="student-details-container">
      <button className="btn btn-outline back-button" onClick={() => navigate("/")}>
        Back to Dashboard
      </button>

      <div className="student-details-card">
        <div className="student-details-header">
          <h2 className="student-details-title">{student.name}</h2>
          <p className="student-details-email">{student.email}</p>
        </div>
        <div className="student-details-content">
          <div className="student-info-sections">
            <div className="student-info-section">
              <h3 className="student-info-title">Student Information</h3>
              <div className="student-info-grid">
                <div className="student-info-item">
                  <span className="student-info-label">ID:</span>
                  <span className="student-info-value">{student.id}</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Course:</span>
                  <span className="student-info-value">{student.course}</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Enrollment Date:</span>
                  <span className="student-info-value">{student.enrollmentDate}</span>
                </div>
              </div>
            </div>

            <div className="student-info-section">
              <h3 className="student-info-title">Academic Status</h3>
              <div className="student-info-grid">
                <div className="student-info-item">
                  <span className="student-info-label">Status:</span>
                  <span className="status-active">Active</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">Attendance:</span>
                  <span className="student-info-value">85%</span>
                </div>
                <div className="student-info-item">
                  <span className="student-info-label">GPA:</span>
                  <span className="student-info-value">3.5</span>
                </div>
              </div>
            </div>
          </div>

          <div className="additional-info-section">
            <h3 className="student-info-title">Additional Information</h3>
            <p className="additional-info">
              This section would contain additional information about the student, such as their academic history,
              contact details, emergency contacts, and any other relevant information.
            </p>
          </div>
        </div>
        <div className="student-details-footer">
          <button className="btn btn-outline">Edit Student</button>
          <button className="btn btn-destructive">Delete Student</button>
        </div>
      </div>
    </div>
  )
}

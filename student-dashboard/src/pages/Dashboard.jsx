"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import axios from "axios"
import "../styles/dashboard.css"

export default function Dashboard() {
  const [students, setStudents] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })

    // Fetch students data
    fetchStudents()

    return () => unsubscribe()
  }, [])

  // Fetch students from the mock API
  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students")

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        setStudents(response.data)
        setFilteredStudents(response.data)

        // Extract unique courses for the filter dropdown
        const uniqueCourses = [...new Set(response.data.map((student) => student.course))]
        setCourses(uniqueCourses)
      } else {
        console.error("API response is not an array:", response.data)
        setError("Invalid data format received from server")
        setStudents([])
        setFilteredStudents([])
        setCourses([])
      }
    } catch (error) {
      console.error("Error fetching students:", error)
      setError("Failed to fetch students")
      setStudents([])
      setFilteredStudents([])
      setCourses([])
    }
  }

  // Filter students based on selected course and search query
  useEffect(() => {
    if (!Array.isArray(students)) {
      setFilteredStudents([])
      return
    }

    let result = [...students]

    // Filter by course if selected
    if (selectedCourse && selectedCourse !== "all") {
      result = result.filter((student) => student.course === selectedCourse)
    }

    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (student) => student.name.toLowerCase().includes(query) || student.email.toLowerCase().includes(query),
      )
    }

    setFilteredStudents(result)
  }, [selectedCourse, searchQuery, students])

  // Handle course filter change
  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value)
  }

  // Navigate to add student page
  const handleAddStudent = () => {
    navigate("/add-student")
  }

  // Navigate to student details page
  const handleViewDetails = (id) => {
    navigate(`/student/${id}`)
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Manage your students and courses</p>
        </div>
        <div className="user-info">
          {user ? (
            <div className="flex items-center gap-2">
              <p className="user-email">Logged in as: {user.email}</p>
              <button className="btn btn-outline" onClick={() => navigate("/logout")}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>
          )}
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="main-content">
          {/* Search and filter controls */}
          <div className="dashboard-controls">
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input dashboard-search"
            />
            <select value={selectedCourse} onChange={handleCourseChange} className="form-select dashboard-filter">
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleAddStudent}>
              Add Student
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Student list */}
          <div className="student-list">
            {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div key={student.id} className="student-card">
                  <div className="student-card-header">
                    <h3 className="student-card-title">{student.name}</h3>
                    <p className="student-card-email">{student.email}</p>
                  </div>
                  <div className="student-card-content">
                    <div className="student-card-info">
                      <div>
                        <p className="info-label">Course</p>
                        <p className="info-value">{student.course}</p>
                      </div>
                      <div>
                        <p className="info-label">Enrollment Date</p>
                        <p className="info-value">{student.enrollmentDate}</p>
                      </div>
                    </div>
                  </div>
                  <div className="student-card-footer">
                    <button className="btn btn-outline" onClick={() => handleViewDetails(student.id)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No students found</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="stats-sidebar">
          <div className="stats-card">
            <div className="stats-card-header">
              <h3 className="stats-card-title">Statistics</h3>
            </div>
            <div className="stats-card-content">
              <div className="stats-list">
                <div className="stats-item">
                  <span className="stats-label">Total Students:</span>
                  <span className="stats-value">{Array.isArray(students) ? students.length : 0}</span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Courses:</span>
                  <span className="stats-value">{Array.isArray(courses) ? courses.length : 0}</span>
                </div>
                <div className="stats-item">
                  <span className="stats-label">Filtered Results:</span>
                  <span className="stats-value">{Array.isArray(filteredStudents) ? filteredStudents.length : 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

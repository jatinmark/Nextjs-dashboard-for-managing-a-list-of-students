"use client"

import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Logout from "./pages/Logout"
import AddStudent from "./pages/AddStudent"
import StudentDetails from "./pages/StudentDetails"
import { useEffect } from "react"
import { setupMockAPI } from "./lib/mock-api"

function App() {
  // Setup mock API on app initialization
  useEffect(() => {
    setupMockAPI()
  }, [])

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/student/:id" element={<StudentDetails />} />
      </Routes>
    </div>
  )
}

export default App

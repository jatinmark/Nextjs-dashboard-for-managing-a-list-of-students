import axios from "axios"
import MockAdapter from "axios-mock-adapter"

// Sample student data
const students = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    course: "Mathematics",
    enrollmentDate: "2023-08-15",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    course: "Physics",
    enrollmentDate: "2023-09-05",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    course: "Chemistry",
    enrollmentDate: "2023-08-20",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    course: "Biology",
    enrollmentDate: "2023-09-10",
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    course: "Computer Science",
    enrollmentDate: "2023-08-25",
  },
  {
    id: "7",
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    course: "Mathematics",
    enrollmentDate: "2023-09-15",
  },
  {
    id: "8",
    name: "Fiona Gallagher",
    email: "fiona.gallagher@example.com",
    course: "Physics",
    enrollmentDate: "2023-08-30",
  },
]

// Setup mock API
export const setupMockAPI = () => {
  // Create a new instance of MockAdapter
  const mock = new MockAdapter(axios)

  // Mock GET request to fetch all students
  // Make sure we're returning an array in the response
  mock.onGet("/api/students").reply(200, students)

  // Mock GET request to fetch a specific student by ID
  mock.onGet(/\/api\/students\/\d+/).reply((config) => {
    // Extract the student ID from the URL
    const id = config.url.split("/").pop()
    // Find the student with the matching ID
    const student = students.find((s) => s.id === id)

    if (student) {
      return [200, student]
    } else {
      return [404, { message: "Student not found" }]
    }
  })

  // Mock POST request to add a new student
  mock.onPost("/api/students").reply((config) => {
    // Parse the request body
    const newStudent = JSON.parse(config.data)

    // Generate a new ID (in a real app, this would be done by the database)
    newStudent.id = String(students.length + 1)

    // Add the new student to our array
    students.push(newStudent)

    return [201, newStudent]
  })

  return mock
}

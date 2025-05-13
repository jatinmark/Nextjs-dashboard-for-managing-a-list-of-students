// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmGHCKBA1M-SLGBFo8a1-5NTUkLrSr3Yk",
  authDomain: "student-list-management.firebaseapp.com",
  projectId: "student-list-management",
  storageBucket: "student-list-management.firebasestorage.app",
  messagingSenderId: "256818993042",
  appId: "1:256818993042:web:0f77358363b629a990534b",
  measurementId: "G-FJ0SYCFL4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app

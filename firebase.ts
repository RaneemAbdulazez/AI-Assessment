// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcX1zeGag4XU2cqHlVYn4m3mVoAeBQCIQ",
  authDomain: "ai-assesment-17821.firebaseapp.com",
  projectId: "ai-assesment-17821",
  storageBucket: "ai-assesment-17821.firebasestorage.app",
  messagingSenderId: "191290134928",
  appId: "1:191290134928:web:68aa1bf71092130fab6315"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth instance
export const auth = getAuth(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-93c43.firebaseapp.com",
  projectId: "mern-auth-93c43",
  storageBucket: "mern-auth-93c43.appspot.com",
  messagingSenderId: "110903782040",
  appId: "1:110903782040:web:2e1698388d1af7f812beed"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
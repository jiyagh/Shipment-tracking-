// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxNYfSiRck29ZqMjCceJ-UTs7-FY4YOXY",
  authDomain: "swift-track-562f8.firebaseapp.com",
  projectId: "swift-track-562f8",
  storageBucket: "swift-track-562f8.firebasestorage.app",
  messagingSenderId: "933586682775",
  appId: "1:933586682775:web:91cafef51fb6ebd2c3fad2",
  measurementId: "G-8YXVPK192H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
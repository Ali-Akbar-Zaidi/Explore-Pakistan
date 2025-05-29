// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoeiXsGLA38eLoi4UjhCdn8yDxMYU0lLU",
  authDomain: "explore-pakistan-c2180.firebaseapp.com",
  databaseURL: "https://explore-pakistan-c2180-default-rtdb.firebaseio.com",
  projectId: "explore-pakistan-c2180",
  storageBucket: "explore-pakistan-c2180.firebasestorage.app",
  messagingSenderId: "597291536381",
  appId: "1:597291536381:web:f9802ea4a8c72156ef9394",
  measurementId: "G-YYR77QWZJM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
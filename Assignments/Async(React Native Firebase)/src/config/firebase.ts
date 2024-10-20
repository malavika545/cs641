// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdYue4W-BoW3gtPh8OoYnk_4nkVDDYkS4",
  authDomain: "test-auth-60f78.firebaseapp.com",
  projectId: "test-auth-60f78",
  storageBucket: "test-auth-60f78.appspot.com",
  messagingSenderId: "596067435734",
  appId: "1:596067435734:web:d3988629ccd9ee73eb3577",
  measurementId: "G-EBZ36CCZW9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
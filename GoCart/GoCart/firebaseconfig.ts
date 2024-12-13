// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApAj5IylS7DgSy5bmD1SE2NLx84mItSVQ",
  authDomain: "gokart-19d22.firebaseapp.com",
  projectId: "gokart-19d22",
  storageBucket: "gokart-19d22.firebasestorage.app",
  messagingSenderId: "263383792771",
  appId: "1:263383792771:web:2c82aa76882f52246bafb6",
  measurementId: "G-0X0J4REXBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
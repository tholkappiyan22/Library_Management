// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBylzmxBL2wEp7PtgcvTHyvDRmfALgZ8aE",
  authDomain: "bookworm-portal-nexus-main.firebaseapp.com",
  projectId: "bookworm-portal-nexus-main",
  storageBucket: "bookworm-portal-nexus-main.firebasestorage.app",
  messagingSenderId: "885399956976",
  appId: "1:885399956976:web:a46cc5303fcc7f7800c135",
  measurementId: "G-8E694MGPJH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
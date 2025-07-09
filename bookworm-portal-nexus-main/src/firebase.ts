// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Using a different import style to troubleshoot a potential environment issue
import * as firestore from "firebase/firestore";

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

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
// Initialize Cloud Firestore and get a reference to the service
// export const db = firestore.getFirestore(app);


export default app;

// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASerL1w7qwhmMZVnCon8R7PqnYGnuTHuY",
  authDomain: "memory-game-portfolio.firebaseapp.com",
  projectId: "memory-game-portfolio",
  storageBucket: "memory-game-portfolio.firebasestorage.app",
  messagingSenderId: "950138046155",
  appId: "1:950138046155:web:5b9cfbbe253a0b26d27d4e"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

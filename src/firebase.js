import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA7mm-HUHqWdhhOsYpD9FIjuL_eh5OixT8",
  authDomain: "pashudhan-ai.firebaseapp.com",
  projectId: "pashudhan-ai",
  storageBucket: "pashudhan-ai.firebasestorage.app",
  messagingSenderId: "52756339086",
  appId: "1:52756339086:web:6c6dec82482dabb834ecdf",
  measurementId: "G-1SBVCT1W9R"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
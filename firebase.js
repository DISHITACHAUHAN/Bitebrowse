import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2uqsvrB2FtYlXj_cNt556y279G3YELUM",
  authDomain: "bitebrowse-3b53a.firebaseapp.com",
  projectId: "bitebrowse-3b53a",
  storageBucket: "bitebrowse-3b53a.firebasestorage.app",
  messagingSenderId: "406687486041",
  appId: "1:406687486041:web:0fba333267a864bd4aa148",
  measurementId: "G-N5W7HE272H"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

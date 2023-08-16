import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtqtWzKzxt5WtvU2P9xZG37et_iyoXHUU",
  authDomain: "chat-d19de.firebaseapp.com",
  projectId: "chat-d19de",
  storageBucket: "chat-d19de.appspot.com",
  messagingSenderId: "38527607865",
  appId: "1:38527607865:web:67732b9a2d5145d1b5d9e8",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();

import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, serverTimestamp, set, get, orderByChild } from "firebase/database";
import { query } from "firebase/firestore";

import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAgB6EMXnXNL0rMbp8EyeCkPdRYVvOUI50",
  authDomain: "sri-hari-astro.firebaseapp.com",
  databaseURL: "https://sri-hari-astro-default-rtdb.firebaseio.com",
  projectId: "sri-hari-astro",
  storageBucket: "sri-hari-astro.firebasestorage.app",
  messagingSenderId: "897514154521",
  appId: "1:897514154521:web:fac5bd35ff731a036b1888",
  measurementId: "G-TGWFPW59JX"
};

//! Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//! Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);

export { database, ref, push, onValue, serverTimestamp, set, messaging, get, orderByChild, query };
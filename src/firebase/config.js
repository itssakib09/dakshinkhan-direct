import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyCQYXb2aUe-lb38J1QFzNfm4-QexUhqkWM",
  authDomain: "dakshinkhan-direct.firebaseapp.com",
  projectId: "dakshinkhan-direct",
  storageBucket: "dakshinkhan-direct.firebasestorage.app",
  messagingSenderId: "309059909193",
  appId: "1:309059909193:web:a6060078391226b07ff198",
  measurementId: "G-KYCX427QNV"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, 'dakshinkhan-direct');
export const storage = getStorage(app, 'dakshinkhan-direct.firebasestorage.app'); 

// Enable offline persistence for Firestore
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Persistence failed: Multiple tabs open')
  } else if (err.code === 'unimplemented') {
    console.warn('Persistence not supported by browser')
  }
})

// Set auth persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Auth persistence error:', err)
})

export default app;
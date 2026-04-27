// config.js
import { initializeApp } from "firebase/app"
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"
import { getFirestore, initializeFirestore, persistentLocalCache } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCQYXb2aUe-lb38J1QFzNfm4-QexUhqkWM",
  authDomain: "dakshinkhan-direct.firebaseapp.com",
  projectId: "dakshinkhan-direct",
  storageBucket: "dakshinkhan-direct.firebasestorage.app",
  messagingSenderId: "309059909193",
  appId: "1:309059909193:web:a6060078391226b07ff198",
  measurementId: "G-KYCX427QNV"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
}, 'dakshinkhan-direct')

export const storage = getStorage(app, 'gs://dakshinkhan-direct.firebasestorage.app')

setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Auth persistence error:', err)
})

export const USE_API = import.meta.env.VITE_USE_API === 'true'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default app
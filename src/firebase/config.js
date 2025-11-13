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

// Auth
export const auth = getAuth(app)

// Firestore with custom database name + new persistence (no warnings)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({})
}, 'dakshinkhan-direct')

// Storage with custom bucket
export const storage = getStorage(app, 'gs://dakshinkhan-direct.firebasestorage.app')

// Set auth persistence
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error('Auth persistence error:', err)
})

export default app
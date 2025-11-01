import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const db = getFirestore(app);
export default app;
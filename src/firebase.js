// Legg inn dine egne Firebase-verdier her
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCquJwgiiMLMw3GZxkQ53Rg_mVd3eevuDQ",
  authDomain: "recipe-dieting-from-inside-out.firebaseapp.com",
  projectId: "recipe-dieting-from-inside-out",
  storageBucket: "recipe-dieting-from-inside-out.firebasestorage.app",
  messagingSenderId: "322081475047",
  appId: "1:322081475047:web:125b4d6a061f803443d542"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
// Legg inn dine egne Firebase-verdier her
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCpOQPvdsj6cPaCmTebhuMzdG7dUcJzbCA",
  authDomain: "recipe-app-aeva.firebaseapp.com",
  projectId: "recipe-app-aeva",
  storageBucket: "recipe-app-aeva.firebasestorage.app",
  messagingSenderId: "607612168179",
  appId: "1:607612168179:web:cedadf7378392a267a5486"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
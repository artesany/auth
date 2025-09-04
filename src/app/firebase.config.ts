// src/app/firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import{getFirestore}from 'firebase/firestore'

const firebaseConfig = {
   apiKey: "AIzaSyA6GRjP8nfe4KDNJv9PSUyLXfd_tfWf4z4",
  authDomain: "auth-a46c5.firebaseapp.com",
  projectId: "auth-a46c5",
  storageBucket: "auth-a46c5.firebasestorage.app",
  messagingSenderId: "854721930411",
  appId: "1:854721930411:web:f973d969bd4432543b43ee"
};

// Inicializa la app
export const firebaseApp = initializeApp(firebaseConfig);

// Exporta Auth
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

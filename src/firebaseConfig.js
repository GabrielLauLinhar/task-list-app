// firebaseConnection.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAqXfQ7m-8lAdXbwpDFNudoA5ixfsHAf6c",
    authDomain: "atividade-firebase-70ab1.firebaseapp.com",
    projectId: "atividade-firebase-70ab1",
    storageBucket: "atividade-firebase-70ab1.appspot.com",
    messagingSenderId: "399895958130",
    appId: "1:399895958130:web:b20811576aebfce5dda8eb",
    measurementId: "G-GF370TYDGY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

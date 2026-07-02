import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBFyaauq2KPs1yFFIoZCLT0USzpWEKvqHo",
    authDomain: "learning-app-511d8.firebaseapp.com",
    projectId: "learning-app-511d8",
    storageBucket: "learning-app-511d8.firebasestorage.app",
    messagingSenderId: "265664588658",
    appId: "1:265664588658:web:cb538f72df9f58a6788beb",
    measurementId: "G-BGTZC85WV1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
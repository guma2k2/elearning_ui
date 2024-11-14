// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA0WVf8qxsbwMooOqIJpBXCegtFOmitMHA",
    authDomain: "elearning-fb.firebaseapp.com",
    projectId: "elearning-fb",
    storageBucket: "elearning-fb.firebasestorage.app",
    messagingSenderId: "742909504731",
    appId: "1:742909504731:web:d54fe72560541c09feb0fe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
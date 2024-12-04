// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDogpUz5utg8GqOlHYpOro8X_QKjOEy04U",
    authDomain: "doan-d45ca.firebaseapp.com",
    projectId: "doan-d45ca",
    storageBucket: "doan-d45ca.firebasestorage.app",
    messagingSenderId: "827800410326",
    appId: "1:827800410326:web:e31097a529f81012bad177",
    measurementId: "G-7F2199QMLH",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js");
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

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("public\firebase-messaging-sw.js")
        .then(function (registration) {
            console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
        });
}
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log("Received background message: ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/firebase-logo.png", // Optional icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

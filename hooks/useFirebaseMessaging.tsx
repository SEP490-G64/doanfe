import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { messaging } from "@/firebase/firebase";

const useFirebaseMessaging = () => {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/firebase-messaging-sw.js")
                .then((registration) => {
                    console.log("Service Worker registered:", registration);
                })
                .catch((err) => {
                    console.error("Service Worker registration failed:", err);
                });
        }

        const unsubscribe = onMessage(messaging, (payload) => {
            // console.log("Message received: ", payload);

            // Hiển thị thông báo với React Toastify
            toast.info(payload.notification?.body);
        });

        return unsubscribe;
    }, []);
};

export default useFirebaseMessaging;

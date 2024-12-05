import { onMessage } from "firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { messaging } from "@/firebase/firebase";

const useFirebaseMessaging = () => {
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            // console.log("Message received: ", payload);

            // Hiển thị thông báo với React Toastify
            toast.info(payload.notification?.body);
        });

        return unsubscribe;
    }, []);
};

export default useFirebaseMessaging;

import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const getAllNotifications = async (userId: string, token: string) => {
    try {
        const res = await httpRequest.get(`/dsd/api/v1/staff/notification/${userId}/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getQuantityUnreadNoti = async (userId: string, token: string) => {
    try {
        const res = await httpRequest.get(`/dsd/api/v1/staff/notification/${userId}/unread-quantity`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const markAsRead = async (userId: string, notiId: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `/dsd/api/v1/staff/notification/${userId}/${notiId}/read`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

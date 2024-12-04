/* eslint-disable @typescript-eslint/no-explicit-any */
import { ForgotPasswordType, LoginBodyType, RegisterBodyType } from "@/lib/schemaValidate/authSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { postResetPassword } from "@/utils/httpRequests";

export const login = async (user: LoginBodyType) => {
    try {
        const res = await httpRequest.post("/dsd/api/v1/auth/login", user);
        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Sai tên đăng nhập hoặc mật khẩu");
        else if (error.status === 403) toast.error("Tài khoản vô hiệu hóa");
        else {
            toast.error("Đăng nhập thất bại");
            console.log(error);
        }
    }
};

export const registerAcc = async (user: RegisterBodyType) => {
    try {
        const res = await httpRequest.post("/dsd/api/v1/auth/register", user);
        if (res.errors) {
            toast.error("Email hoặc tên người dùng đã tồn tại");
        }
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const sendResetRequest = async (request: ForgotPasswordType) => {
    try {
        const res = await httpRequest.postResetPassword(
            "/dsd/api/v1/auth/forget-password",
            request.email, // Gửi chuỗi email thay vì object
            {
                headers: {
                    "Content-Type": "text/plain", // Đặt đúng Content-Type
                },
            }
        );

        if (res.errors) {
            toast.error(res.errors[0]);
            return;
        }

        return res;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const logout = async (token: string) => {
    try {
        await httpRequest.post(
            "auth/logout",
            {},
            {
                headers: { authorization: `Bearer ${token}` },
            }
        );
    } catch (error) {
        console.log(error);
    }
};

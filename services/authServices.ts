/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginBodyType, RegisterBodyType } from "@/lib/schemaValidate/authSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const login = async (user: LoginBodyType) => {
    try {
        const res = await httpRequest.post("/dsd/api/v1/auth/login", user);

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Sai tên đăng nhập hoặc mật khẩu");
        else {
            toast.error("Đăng nhập thất bại");
            console.log(error);
        }
    }
};

export const register = async (user: RegisterBodyType) => {
    try {
        const body = { type: "email", ...user };
        const res = await httpRequest.post("auth/register", body);

        return res;
    } catch (error) {
        console.log(error);
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

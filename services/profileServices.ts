/* eslint-disable @typescript-eslint/no-explicit-any */
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { ChangePasswordBodyType, ProfileBodyType } from "@/lib/schemaValidate/profileSchema";
import { SupplierBodyType } from "@/lib/schemaValidate/supplierSchema";

export const getProfile = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};

export const updateProfile = async (profile: ProfileBodyType, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/profile`, profile, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật hồ sơ thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Email hoặc tên người dùng đã tồn tại");
            return res;
        }
    } catch (error: any) {
        toast.error("Cập nhật hồ sơ thất bại");
        console.log(error);
    }
};

export const changePassword = async (changePasswordBody: ChangePasswordBodyType, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/profile/change-password`, changePasswordBody, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.errors) {
            toast.error("Mật khẩu cũ chưa chính xác");
            return res;
        }

        if (res) {
            toast.success(res);
            return res;
        }
    } catch (error: any) {
        toast.error("Đổi mật khẩu thất bại");
        console.log(error);
    }
};

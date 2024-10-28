/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserBodyType } from "@/lib/schemaValidate/userSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const getListUser = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size },
        });

        console.log(res);
        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getUserById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};
export const createUser = async (User: UserBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/admin/user", User, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(User);

        if (res.data) {
            toast.success("Tạo mới người dùng thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.user.exist")) {
                toast.error("Người dùng đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới người dùng thất bại");
            console.log(error);
        }
    }
};

export const updateUser = async (User: UserBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/admin/user/${id}`, User, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log(User);

        if (res.data) {
            toast.success("Cập nhật người dùng thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.user.exist")) {
                toast.error("Người dùng đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật người dùng thất bại");
            console.log(error);
        }
    }
};

export const deleteUser = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/admin/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa người dùng thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa người dùng thất bại");
            console.log(error);
        }
    }
};

export const activateUser = async (id: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/admin/user/activate/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.data) {
            if (res.data.status === "ACTIVATE") {
                toast.success("Kích hoạt người dùng thành công");
            } else {
                toast.success("Vô hiệu hóa người dùng thành công");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Kích hoạt / Vô hiệu hóa người dùng thất bại");
            console.log(error);
        }
    }
};

export const getRegistrationRequests = async (page: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/user/registration-requests`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page },
        });

        console.log(res);
        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const approveUser = async (id: string, accept: boolean, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/admin/user/verify-user/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { accept },
            }
        );

        if (res.data) {
            if (accept) {
                toast.success("Duyệt người dùng thành công");
            } else {
                toast.success("Từ chối người dùng thành công");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            if (accept) {
                toast.error("Duyệt người dùng thất bại");
            } else {
                toast.error("Từ chối người dùng thất bại");
            }
            console.log(error);
        }
    }
};

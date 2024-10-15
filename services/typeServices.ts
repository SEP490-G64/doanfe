/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeBodyType } from "@/lib/schemaValidate/typeSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const getListType = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/type`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};

export const getTypeById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/type/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};
export const createType = async (Type: TypeBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/type", Type, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới loại sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Loại sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        toast.error("Tạo mới loại sản phẩm thất bại");
        console.log(error);
    }
};

export const updateType = async (Type: TypeBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/type/${id}`, Type, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật loại sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Loại sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        toast.error("Cập nhật loại sản phẩm thất bại");
        console.log(error);
    }
};

export const deleteType = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/type/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa loại sản phẩm thành công");
            return res.data;
        }
    } catch (error: any) {
        toast.error("Xóa loại sản phẩm thất bại");
        console.log(error);
    }
};
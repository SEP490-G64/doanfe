/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryBodyType } from "@/lib/schemaValidate/categorySchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/supplier";

export const getAllCategory = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/category`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getListCategory = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
    const params: Params = {
        page,
        size,
    };

    for (const searchKey in dataSearch) {
        if (dataSearch[searchKey as keyof typeof dataSearch]) {
            params[searchKey as keyof typeof params] = dataSearch[searchKey as keyof typeof dataSearch];
        }
    }

    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/category`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getCategoryById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/category/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};
export const createCategory = async (category: CategoryBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/category", category, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới nhóm sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Nhóm sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới nhóm sản phẩm thất bại");
            console.log(error);
        }
    }
};

export const updateCategory = async (category: CategoryBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/category/${id}`, category, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật nhóm sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Nhóm sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật nhóm sản phẩm thất bại");
            console.log(error);
        }
    }
};

export const deleteCategory = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/category/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa nhóm sản phẩm thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa nhóm sản phẩm thất bại");
            console.log(error);
        }
    }
};

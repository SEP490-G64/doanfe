/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductBodyType } from "@/lib/schemaValidate/productSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const getListProduct = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size, branchId: "1" },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};

export const getProductById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};
export const createProduct = async (product: ProductBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/product", product, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        toast.error("Tạo mới sản phẩm thất bại");
        console.log(error);
    }
};

export const updateProduct = async (product: ProductBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/product/${id}`, product, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật sản phẩm thành công");
            return res;
        }
    } catch (error: any) {
        toast.error("Cập nhật sản phẩm thất bại");
        console.log(error);
    }
};

export const deleteProduct = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa sản phẩm thành công");
            return res.data;
        }
    } catch (error: any) {
        toast.error("Xóa sản phẩm thất bại");
        console.log(error);
    }
};
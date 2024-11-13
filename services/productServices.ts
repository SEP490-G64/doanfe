/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductBodyType } from "@/lib/schemaValidate/productSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/product";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getListProduct = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/product`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/${id}`, {
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

export const getProductBySupplierId = async (supplierId: string, keyword: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/products-by-supplier/${supplierId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getProductByBranchId = async (branchId: string, keyword: string, token: string, supplierId?: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/products-in-branch/${branchId}`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword, checkValid: true, supplierId },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getAllowedProducts = async (keyword: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/product/allow-products`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { keyword },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const createProduct = async (product: ProductBodyType, token: string) => {
    try {
        console.log(product);
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
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới sản phẩm thất bại");
            console.log(error);
        }
    }
};

export const updateProduct = async (product: ProductBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/product/${id}`, product, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật sản phẩm thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Sản phẩm đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật sản phẩm thất bại");
            console.log(error);
        }
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
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa sản phẩm thất bại");
            console.log(error);
        }
    }
};

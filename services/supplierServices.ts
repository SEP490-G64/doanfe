/* eslint-disable @typescript-eslint/no-explicit-any */
import { SupplierBodyType } from "@/lib/schemaValidate/supplierSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/supplier";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getAllSupplier = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/supplier`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getListSupplier = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/supplier`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getSupplierById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/supplier/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};
export const createSupplier = async (Supplier: SupplierBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/supplier", Supplier, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới nhà cung cấp thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.supplier.exist")) {
                toast.error("Tên và địa chỉ nhà cung cấp đã tồn tại");
            } else if (res.errors.includes("error.supplier.taxcode_exist")) {
                toast.error("Mã số thuế của nhà cung cấp đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới nhà cung cấp thất bại");
            console.log(error);
        }
    }
};

export const updateSupplier = async (Supplier: SupplierBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/supplier/${id}`, Supplier, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật nhà cung cấp thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.supplier.exist")) {
                toast.error("Tên và địa chỉ nhà cung cấp đã tồn tại");
            } else if (res.errors.includes("error.supplier.taxcode_exist")) {
                toast.error("Mã số thuế của nhà cung cấp đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật nhà cung cấp thất bại");
            console.log(error);
        }
    }
};

export const deleteSupplier = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/supplier/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa nhà cung cấp thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa nhà cung cấp thất bại");
            console.log(error);
        }
    }
};

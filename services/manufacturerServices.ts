/* eslint-disable @typescript-eslint/no-explicit-any */
import { ManufacturerBodyType } from "@/lib/schemaValidate/manufacturerSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/supplier";

export const getAllManufacturer = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/manufacturer`, {
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

export const getListManufacturer = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/manufacturer`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getManufacturerById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/manufacturer/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};
export const createManufacturer = async (manufacturer: ManufacturerBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/manufacturer", manufacturer, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới nhà sản xuất thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.manufacturer.exist")) {
                toast.error("Tên và địa chỉ nhà sản xuất đã tồn tại");
            } else if (res.errors.includes("error.manufacturer.taxcode_not_exist")) {
                toast.error("Mã số thuế của nhà sản xuất đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới nhà sản xuất thất bại");
            console.log(error);
        }
    }
};

export const updateManufacturer = async (manufacturer: ManufacturerBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/manufacturer/${id}`, manufacturer, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật nhà sản xuất thành công");
            return res;
        }

        if (res.errors) {
            if (res.errors.includes("error.manufacturer.exist")) {
                toast.error("Tên và địa chỉ nhà sản xuất đã tồn tại");
            } else if (res.errors.includes("error.manufacturer.taxcode_not_exist")) {
                toast.error("Mã số thuế của nhà sản xuất đã tồn tại");
            }
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật nhà sản xuất thất bại");
            console.log(error);
        }
    }
};

export const deleteManufacturer = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/manufacturer/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa nhà sản xuất thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa nhà sản xuất thất bại");
            console.log(error);
        }
    }
};

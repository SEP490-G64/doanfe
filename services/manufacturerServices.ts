/* eslint-disable @typescript-eslint/no-explicit-any */
import { ManufacturerBodyType } from "@/lib/schemaValidate/manufacturerSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const getAllManufacturer = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/manufacturer`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};

export const getListManufacturer = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/manufacturer`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size },
        });

        return res;
    } catch (error: any) {
        console.log(error);
    }
};

export const getManufacturerById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/manufacturer/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        console.log(error);
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
        toast.error("Tạo mới nhà sản xuất thất bại");
        console.log(error);
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
        toast.error("Cập nhật nhà sản xuất thất bại");
        console.log(error);
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
        toast.error("Xóa nhà sản xuất thất bại");
        console.log(error);
    }
};

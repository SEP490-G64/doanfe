/* eslint-disable @typescript-eslint/no-explicit-any */
import { StorageLocationBodyType } from "@/lib/schemaValidate/storageLocationSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/supplier";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getStaffStorageLocations = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/storage-location`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getAllStorageLocation = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/storage-location`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getListStorageLocation = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/storage-location`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getStorageLocationById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/storage-location/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const createStorageLocation = async (StorageLocation: StorageLocationBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/storage-location", StorageLocation, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới chi nhánh thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Chi nhánh đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới chi nhánh thất bại");
            console.log(error);
        }
    }
};

export const updateStorageLocation = async (StorageLocation: StorageLocationBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/storage-location/${id}`, StorageLocation, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật chi nhánh thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Chi nhánh đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật chi nhánh thất bại");
            console.log(error);
        }
    }
};

export const deleteStorageLocation = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/storage-location/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa chi nhánh thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa chi nhánh thất bại");
            console.log(error);
        }
    }
};
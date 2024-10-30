/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnitBodyType } from "@/lib/schemaValidate/unitSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/unit";

export const getAllUnit = async (token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/unit-of-measurement`, {
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

export const getListUnit = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/unit-of-measurement`, {
            headers: { Authorization: `Bearer ${token}` },
            params,
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getUnitById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/unit-of-measurement/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};
export const createUnit = async (Unit: UnitBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/unit-of-measurement", Unit, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Tạo mới đơn vị thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Đơn vị đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Tạo mới đơn vị thất bại");
            console.log(error);
        }
    }
};

export const updateUnit = async (Unit: UnitBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/unit-of-measurement/${id}`, Unit, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật đơn vị thành công");
            return res;
        }

        if (res.errors) {
            toast.error("Đơn vị đã tồn tại");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật đơn vị thất bại");
            console.log(error);
        }
    }
};

export const deleteUnit = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/unit-of-measurement/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa đơn vị thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa đơn vị thất bại");
            console.log(error);
        }
    }
};

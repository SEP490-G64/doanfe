/* eslint-disable @typescript-eslint/no-explicit-any */
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { CheckBodyType } from "@/lib/schemaValidate/inventoryCheckSchema";
import { DataSearch } from "@/types/inbound";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getListInventoryCheck = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/inventory-check`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size, ...dataSearch },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

export const getInventoryCheckById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/inventory-check/${id}`, {
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

export const getSubcribe = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/inventory-check/${id}/subscribe`, {
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

export const createInitInventoryCheck = async (token: string) => {
    try {
        const res = await httpRequest.post(
            `dsd/api/v1/staff/inventory-check/create-init-check`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.data) {
            toast.success("Khởi tạo đơn kiểm hàng thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Khởi tạo đơn kiểm hàng thất bại");
            console.log(error);
        }
    }
};

export const submitDraft = async (checkDraft: CheckBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/inventory-check/submit-draft", checkDraft, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Lưu phiếu kiểm thất bại");
            console.log(error);
        }
    }
};

export const changeInventoryCheckStatus = async (id: string, status: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/inventory-check/${id}/update-status`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { type: status },
            }
        );

        if (res.status === "SUCCESS") {
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Thay đổi trạng thái phiếu kiểm thất bại");
            console.log(error);
        }
    }
};

export const submitInventoryCheck = async (id: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/inventory-check/${id}/submit`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.status === "SUCCESS") {
            toast.success("Duyệt đơn và cân bằng kho thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Kiểm hàng thất bại");
            console.log(error);
        }
    }
};

export const deleteInventoryCheck = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/inventory-check/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa phiếu kiểm hàng thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa phiếu kiểm hàng thất bại");
            console.log(error);
        }
    }
};

export const approveInventoryCheck = async (id: string, accept: boolean, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/inventory-check/approve/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { accept: accept },
            }
        );

        if (res.status === "SUCCESS") {
            if (!accept) toast.success("Từ chối phiếu kiểm thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Duyệt / Từ chối phiếu kiểm thất bại");
            console.log(error);
        }
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { CheckBodyType } from "@/lib/schemaValidate/inventoryCheckSchema";

export const getListInventoryCheck = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/inventory-check`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page, size },
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
            toast.success("Lưu phiếu kiểm thành công");
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
            toast.success("Thay đổi trạng thái phiếu kiểm thành công");
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
            toast.success("Kiểm hàng thành công");
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

export const deleteBranch = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/admin/branch/${id}`, {
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

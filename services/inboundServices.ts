/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchBodyType } from "@/lib/schemaValidate/branchSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";

export const getListBranch = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/branch`, {
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

export const getBranchById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/branch/${id}`, {
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

export const createInitInbound = async (inboundType: "NHAP_TU_NHA_CUNG_CAP" | "CHUYEN_KHO_NOI_BO", token: string) => {
    try {
        const res = await httpRequest.post(
            `dsd/api/v1/staff/inbound/create-init-inbound`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { type: inboundType },
            }
        );

        if (res.data) {
            toast.success("Khởi tạo đơn nhập hàng thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Khởi tạo đơn nhập hàng thất bại");
            console.log(error);
        }
    }
};

export const createBranch = async (branch: BranchBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/admin/branch", branch, {
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

export const updateBranch = async (branch: BranchBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/admin/branch/${id}`, branch, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật chi nhánh thành công");
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

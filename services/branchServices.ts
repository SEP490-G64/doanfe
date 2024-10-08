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
        console.log(error);
    }
};

export const getBranchById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/admin/branch/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res;
    } catch (error: any) {
        console.log(error);
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
    } catch (error: any) {
        toast.error("Tạo mới chi nhánh thất bại");
        console.log(error);
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
        toast.error("Cập nhật chi nhánh thất bại");
        console.log(error);
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
        toast.error("Xóa chi nhánh thất bại");
        console.log(error);
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchBodyType } from "@/lib/schemaValidate/branchSchema";
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { InboundBodyType } from "@/lib/schemaValidate/inboundSchema";

export const getListInbound = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/inbound`, {
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

export const getInboundById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/inbound/${id}`, {
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

export const submitDraft = async (inboundDraft: InboundBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/inbound/submit-draft", inboundDraft, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Lưu phiếu nhập thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Lưu phiếu nhập thất bại");
            console.log(error);
        }
    }
};

export const changeInboundStatus = async (id: string, status: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/inbound/${id}/update-status`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { type: status },
            }
        );

        if (res.status === "SUCCESS") {
            toast.success("Thay đổi trạng thái phiếu nhập thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Thay đổi trạng thái phiếu nhập thất bại");
            console.log(error);
        }
    }
};

export const updateInbound = async (inbound: InboundBodyType, id: string, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/inbound/${id}`, inbound, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Cập nhật phiếu nhập thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Cập nhật phiếu nhập thất bại");
            console.log(error);
        }
    }
};

export const submitInbound = async (id: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/inbound/${id}/submit`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.status === "SUCCESS") {
            toast.success("Nhập hàng thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Nhập hàng thất bại");
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

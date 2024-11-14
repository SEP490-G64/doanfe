/* eslint-disable @typescript-eslint/no-explicit-any */
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { OutboundBodyType } from "@/lib/schemaValidate/outboundSchema";

export const getListOutbound = async (page: number, size: number, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/outbound`, {
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

export const getOutboundById = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/outbound/${id}`, {
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

export const createInitOutbound = async (
    outboundType: "HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO",
    token: string
) => {
    try {
        const res = await httpRequest.post(
            `dsd/api/v1/staff/outbound/create-init-outbound`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { type: outboundType },
            }
        );

        if (res.data) {
            toast.success("Khởi tạo đơn xuất hàng thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Khởi tạo đơn xuất hàng thất bại");
            console.log(error);
        }
    }
};

export const submitDraft = async (outboundDraft: OutboundBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/outbound/submit-draft", outboundDraft, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Lưu phiếu xuất thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Lưu phiếu xuất thất bại");
            console.log(error);
        }
    }
};

export const submitDraftForSell = async (outboundDraft: OutboundBodyType, token: string) => {
    try {
        const res = await httpRequest.post("dsd/api/v1/staff/outbound/submit-draft-sell", outboundDraft, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
            toast.success("Lưu phiếu xuất thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Lưu phiếu xuất thất bại");
            console.log(error);
        }
    }
};

export const changeOutboundStatus = async (id: string, status: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/outbound/${id}/update-status`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { type: status },
            }
        );

        if (res.status === "SUCCESS") {
            toast.success("Thay đổi trạng thái phiếu xuất thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Thay đổi trạng thái phiếu xuất thất bại");
            console.log(error);
        }
    }
};

export const submitOutbound = async (id: string, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/outbound/${id}/submit`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res.status === "SUCCESS") {
            toast.success("Xuất hàng thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xuất hàng thất bại");
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

export const exportOutbound = async (id: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/outbound/generate-outbound/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        });

        if (res) {
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            console.log(error);
        }
    }
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { OutboundBodyType } from "@/lib/schemaValidate/outboundSchema";
import { DataSearch } from "@/types/inbound";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getListOutbound = async (page: string, size: string, dataSearch: DataSearch, token: string) => {
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
        const res = await httpRequest.get(`dsd/api/v1/staff/outbound`, {
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

        if (res.errors) {
            toast.error(res.errors[0]);
            return;
        }

        if (res.data) {
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

        if (res.errors) {
            toast.error(res.errors[0]);
            return;
        }

        if (res.data) {
            toast.success("Xuất bán thành công");
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

export const approveOutbound = async (id: string, accept: boolean, token: string) => {
    try {
        const res = await httpRequest.put(
            `dsd/api/v1/staff/outbound/approve/${id}`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                params: { accept: accept },
            }
        );

        if (res.status === "SUCCESS") {
            if (accept) toast.success("Duyệt phiếu xuất thành công");
            else toast.success("Từ chối phiếu xuất thành công");
            return res;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Duyệt / Từ chối phiếu xuất thất bại");
            console.log(error);
        }
    }
};

export const submitOutbound = async (outboundDraft: OutboundBodyType, token: string) => {
    try {
        const res = await httpRequest.put(`dsd/api/v1/staff/outbound/submit`, outboundDraft, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.errors) {
            toast.error(res.errors[0]);
            return;
        }

        if (res.status === "SUCCESS") {
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

export const deleteOutbound = async (id: string, token: string) => {
    try {
        const res = await httpRequest.deleteAsync(`dsd/api/v1/staff/outbound/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data === "200 OK") {
            toast.success("Xóa phiếu xuất hàng thành công");
            return res.data;
        }
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else {
            toast.error("Xóa phiếu xuất hàng thất bại");
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as httpRequest from "@/utils/httpRequests";
import { toast } from "react-toastify";
import { DataSearch } from "@/types/user";

interface Params extends DataSearch {
    page?: string;
    size?: string;
}

export const getOverviewDashboard = async (branch: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/report`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { branchId: branch },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

export const getDashboardChart = async (branch: string, timeRange: string, token: string) => {
    try {
        const res = await httpRequest.get(`dsd/api/v1/staff/report/chart`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { branchId: branch, timeRange: timeRange },
        });

        return res;
    } catch (error: any) {
        if (error.status === 401) toast.error("Phiên đăng nhập đã hết hạn");
        else console.log(error);
    }
};

"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import { getOverviewDashboard } from "@/services/reportServices";
import { TfiExport, TfiImport } from "react-icons/tfi";
import { MdPrecisionManufacturing, MdProductionQuantityLimits } from "react-icons/md";
import { getStaffBranches } from "@/services/branchServices";
import { Branch } from "@/types/branch";
import { DashboardBodyType } from "@/lib/schemaValidate/reportSchema";

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
    ssr: false,
});

const ECommerce: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [branchOpts, setBranchOpts] = useState<any[]>([]); // Bạn có thể định nghĩa kiểu của branchOpts ở đây
    const [dashboard, setDashboard] = useState<DashboardBodyType>(); // Tùy thuộc vào kiểu của dashboard
    const [selectedBranchId, setSelectedBranchId] = useState<string | null>(""); // State lưu branchId đã chọn
    const { sessionToken } = useAppContext();

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    // Hàm để lấy danh sách chi nhánh
    const getDataOptions = async () => {
        try {
            const response = await Promise.all([getStaffBranches(sessionToken)]);

            if (response) {
                setBranchOpts(response[0].data.map((c: Branch) => ({ value: c.id, label: c.location })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Hàm để lấy các thông tin của dashboard, bao gồm cả branchId
    const getDashboardItems = async (branchId: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getOverviewDashboard(branchId, sessionToken); // Truyền branchId vào API

            if (response.message === "200 OK") {
                setDashboard(response.data);
            } else {
                router.push("/not-found");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDataOptions(); // Lấy danh sách chi nhánh khi component được mount
    }, []);

    useEffect(() => {
        // Khi selectedBranchId thay đổi, gọi lại API để lấy dữ liệu dashboard cho branch đó
        if (selectedBranchId !== null) {
            getDashboardItems(selectedBranchId); // Truyền branchId đã chọn vào API
        } else {
            setSelectedBranchId(userInfo?.branch.id);
        }
    }, [selectedBranchId]); // Khi selectedBranchId thay đổi, thực thi lại hàm này

    // Hàm xử lý sự kiện thay đổi chi nhánh
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const branchId = event.target.value;
        setSelectedBranchId(branchId); // Cập nhật state khi người dùng chọn chi nhánh
    };

    return (
        <>
            <div className="mx-auto w-full">
                <div className="relative mb-4 flex items-center justify-end space-x-2">
                    <label htmlFor="branch" className="text-md font-medium text-black">
                        Chọn chi nhánh:
                    </label>
                    <select
                        id="branch"
                        name="branch"
                        value={selectedBranchId || ""}
                        onChange={handleChange}
                        className="border-gray-300 block w-full max-w-3xl appearance-none rounded-md border px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                        <option value="">Chọn chi nhánh</option>
                        {branchOpts.map((branch) => (
                            <option key={branch.value} value={branch.value}>
                                {branch.label}
                            </option>
                        ))}
                    </select>

                    <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2">
                        <svg
                            className="text-gray-500 fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"></path>
                        </svg>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
                <CardDataStats
                    title="Tổng giá trị nhập"
                    total={dashboard?.dashboardItems?.at(0) ? dashboard?.dashboardItems?.at(0)?.toLocaleString() : "0"}
                >
                    <TfiImport style={{ color: "#0069d9", strokeWidth: "1px" }} />
                </CardDataStats>
                <CardDataStats
                    title="Tổng giá trị xuất"
                    total={dashboard?.dashboardItems?.at(1) ? dashboard?.dashboardItems?.at(1)?.toLocaleString() : "0"}
                >
                    <TfiExport style={{ color: "#0069d9", strokeWidth: "1px" }} />
                </CardDataStats>
                <CardDataStats title="Tổng sản phẩm" total={dashboard?.dashboardItems?.at(2) ?? "0"}>
                    <MdProductionQuantityLimits style={{ color: "#0069d9", fontSize: "22px" }} />
                </CardDataStats>
                <CardDataStats title="Tổng nhà cung cấp" total={dashboard?.dashboardItems?.at(3) ?? "0"}>
                    <MdPrecisionManufacturing style={{ color: "#0069d9", fontSize: "22px" }} />
                </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <div className="col-span-12 xl:col-span-12">
                    <ChartOne branchId={selectedBranchId} />
                </div>

                {loading ? (
                    <div>Đang tải dữ liệu...</div> // Hoặc có thể sử dụng một spinner
                ) : (
                    <>
                        <div className="col-span-12 grid grid-cols-12 gap-4 xl:col-span-12">
                            <div className="col-span-6 xl:col-span-6">
                                <ChartThree data={dashboard?.topCategories} title="Sản phẩm phân loại theo nhóm" />
                            </div>
                            <div className="col-span-6 xl:col-span-6">
                                <ChartThree data={dashboard?.topTypes} title="Sản phẩm phân loại theo loại" />
                            </div>
                        </div>
                    </>
                )}
                <div className="col-span-12 xl:col-span-8">
                    <TableOne data={dashboard?.topFiveProducts} />
                </div>
                <ChatCard data={dashboard?.topFiveSuppliers} />
            </div>
        </>
    );
};

export default ECommerce;

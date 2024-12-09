"use client";

import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { jwtDecode } from "jwt-decode";
import { getDashboardChart } from "@/services/reportServices";
import { toast } from "react-toastify";
import { DashboardChartBodyType } from "@/lib/schemaValidate/reportSchema";
import { formatLargeNumber } from "@/utils/methods";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
    ssr: false,
});

const options: ApexOptions = {
    legend: {
        show: false,
        position: "top",
        horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
        fontFamily: "Satoshi, sans-serif",
        height: 335,
        type: "area",
        dropShadow: {
            enabled: true,
            color: "#623CEA14",
            top: 10,
            blur: 4,
            left: 0,
            opacity: 0.1,
        },
        toolbar: {
            show: false,
        },
    },
    responsive: [
        {
            breakpoint: 1024,
            options: {
                chart: {
                    height: 300,
                },
            },
        },
        {
            breakpoint: 1366,
            options: {
                chart: {
                    height: 350,
                },
            },
        },
    ],
    stroke: {
        width: [2, 2],
        curve: "straight",
    },
    grid: {
        xaxis: {
            lines: {
                show: true,
            },
        },
        yaxis: {
            lines: {
                show: true,
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    markers: {
        size: 4,
        colors: "#fff",
        strokeColors: ["#3056D3", "#80CAEE"],
        strokeWidth: 3,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        hover: {
            sizeOffset: 5,
        },
    },
    xaxis: {
        type: "category",
        categories: [],
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        title: {
            style: {
                fontSize: "0px",
            },
        },
        min: 0,
        labels: {
            formatter: function (value: number) {
                // Format lại trục Y theo kiểu của bạn (ví dụ: triệu, tỷ, ...)
                return formatLargeNumber(value);
            },
        },
    },
};

interface ChartOneProps {
    branchId: string | null;
}

const ChartOne: React.FC<ChartOneProps> = ({ branchId }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [chart, setChart] = useState<DashboardChartBodyType[]>([]);
    const [timeRange, setTimeRange] = useState<string>("Ngày");
    const { sessionToken } = useAppContext();

    const getDashboardChartItems = async (branchId: string, timeRange: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getDashboardChart(branchId, timeRange, sessionToken);

            if (response.message === "200 OK") {
                setChart(response.data); // Dữ liệu đã được kiểm tra và đúng kiểu
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
        if (branchId) {
            getDashboardChartItems(branchId, timeRange);
        } else {
            getDashboardChartItems("", timeRange);
        }
    }, [branchId, timeRange]);

    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
    };

    const categories = chart.map((item) => item.time);
    const startDate = categories.length > 0 ? categories[0] : "";
    const endDate = categories.length > 0 ? categories[categories.length - 1] : "";
    const inboundData = chart.map((item) => item.inbound);
    const outboundData = chart.map((item) => item.outbound);

    // Calculate the maximum value from inbound or outbound data
    const maxValue = Math.max(
        Math.max(...inboundData), // max of inbound
        Math.max(...outboundData) // max of outbound
    );

    const series = [
        {
            name: "Inbound",
            data: inboundData,
        },
        {
            name: "Outbound",
            data: outboundData,
        },
    ];

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default sm:px-7.5 xl:col-span-8 dark:border-strokedark dark:bg-boxdark">
            <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
                <div className="flex w-full flex-wrap gap-3 sm:gap-5">
                    <div className="flex min-w-47.5">
                        <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
                            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
                        </span>
                        <div className="w-full">
                            <p className="font-semibold text-primary">Tổng giá trị nhập</p>
                            <p className="text-sm font-medium">
                                {startDate} đến {endDate}
                            </p>
                        </div>
                    </div>
                    <div className="flex min-w-47.5">
                        <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
                            <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
                        </span>
                        <div className="w-full">
                            <p className="font-semibold text-secondary">Tổng giá trị xuất</p>
                            <p className="text-sm font-medium">
                                {startDate} đến {endDate}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full max-w-45 justify-end">
                    <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
                        {["Ngày", "Tuần", "Tháng", "Quý", "Năm"].map((range) => (
                            <button
                                key={range}
                                className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:text-white dark:hover:bg-boxdark ${timeRange === range ? "bg-primary text-white" : ""}`}
                                onClick={() => handleTimeRangeChange(range)}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <div id="chartOne" className="-ml-5">
                    <ReactApexChart
                        options={{
                            ...options,
                            xaxis: { ...options.xaxis, categories }, // Cập nhật categories cho trục x
                            yaxis: {
                                ...options.yaxis,
                                max: maxValue * 1.1, // Set max value to 110% of the highest data value
                            },
                        }}
                        series={series}
                        type="area"
                        height={350}
                        width={"100%"}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChartOne;

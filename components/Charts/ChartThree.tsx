import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

// Định nghĩa kiểu dữ liệu của props
interface Pair {
    name: string;
    value1: number;
    value2: number;
}

interface ChartThreeProps {
    data: Pair[]; // Dữ liệu kiểu PairBody
    title: string;
}

const options: ApexOptions = {
    chart: {
        fontFamily: "Satoshi, sans-serif",
        type: "donut",
    },
    colors: [
        "#3C50E0",  // Màu xanh dương đậm
        "#6577F3",  // Màu xanh dương nhạt
        "#8FD0EF",  // Màu xanh biển nhạt
        "#0FADCF",  // Màu xanh lam sáng
        "#4C7DF5",  // Màu xanh dương đậm hơn, nhưng vẫn trong tông xanh
        "#A3C6F7",  // Màu xanh nhạt nhẹ, thêm phần mờ
    ], // Các màu sắc của phần donut
    labels: [], // Sẽ cập nhật sau
    legend: {
        show: false,
        position: "bottom",
    },
    plotOptions: {
        pie: {
            donut: {
                size: "65%",
                background: "transparent",
            },
        },
    },
    dataLabels: {
        enabled: false,
    },
    responsive: [
        {
            breakpoint: 2600,
            options: {
                chart: {
                    width: 380,
                },
            },
        },
        {
            breakpoint: 640,
            options: {
                chart: {
                    width: 200,
                },
            },
        },
    ],
};

const ChartThree: React.FC<ChartThreeProps> = ({ data, title }) => {
    // Chuyển đổi dữ liệu vào dạng series và labels
    const series = (data || []).map((item) => item.value1);
    const labels = (data || []).map((item) => item.name);

    return (
        <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default sm:px-7.5 xl:col-span-5 dark:border-strokedark dark:bg-boxdark">
            <div className="mb-3 justify-between gap-4 sm:flex">
                <div>
                    <h5 className="text-xl font-semibold text-black dark:text-white">{title}</h5>
                </div>
            </div>

            <div className="mb-2">
                <div id="chartThree" className="mx-auto flex justify-center">
                    <ReactApexChart options={options} series={series} type="donut" />
                </div>
            </div>

            <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
                {(data || []).map((item, index) => (
                    <div key={index} className="w-full px-8 sm:w-1/2">
                        <div className="flex w-full items-center">
                            <span className="mr-2 block h-3 w-full max-w-3 rounded-full" style={{ backgroundColor: options?.colors[index % options?.colors.length] }}></span>
                            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                                <span> {item.name} </span>
                                <span> {item.value2}% </span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChartThree;

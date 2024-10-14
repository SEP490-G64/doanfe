"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import ProductsTable from "@/components/Tables/ProductsTable";
import IconButton from "@/components/UI/IconButton";
import { ProductInfor } from "@/types/inbound";

const InboundForm = ({ viewMode, outboundId }: { viewMode: "details" | "update" | "create"; outboundId?: string }) => {
    const [products, setProducts] = useState<ProductInfor[]>([
        {
            image: "/images/no-image.png",
            name: "Thuốc nhỏ mắt",
            unit: "Lọ",
            quantity: 100,
            price: 50000,
            discount: 0.25,
            total: 4000000,
        },
        {
            image: "/images/no-image.png",
            name: "Thuốc nhỏ mắt",
            unit: "Lọ",
            quantity: 100,
            price: 50000,
            discount: 0.25,
            total: 4000000,
        },
        {
            image: "/images/no-image.png",
            name: "Thuốc nhỏ mắt",
            unit: "Lọ",
            quantity: 100,
            price: 50000,
            discount: 0.25,
            total: 4000000,
        },
        {
            image: "/images/no-image.png",
            name: "Thuốc nhỏ mắt",
            unit: "Lọ",
            quantity: 100,
            price: 50000,
            discount: 0.25,
            total: 4000000,
        },
        {
            image: "/images/no-image.png",
            name: "Thuốc nhỏ mắt",
            unit: "Lọ",
            quantity: 100,
            price: 50000,
            discount: 0.25,
            total: 4000000,
        },
    ]);

    const addItem = (e?: React.MouseEvent) => {
        e!.preventDefault();
        setProducts([
            ...products,
            {
                image: "/images/no-image.png",
                name: "Thuốc nhỏ mắt",
                unit: "Lọ",
                quantity: 100,
                price: 50000,
                discount: 0.25,
                total: 4000000,
            },
        ]);
    };

    const handleOnClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast.success("Ok roi!");
    };

    return (
        <form className="flex flex-col gap-6">
            {/* <!-- Thông tin xuất hàng --> */}
            <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Thông tin xuất hàng</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Người tạo <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập người tạo"
                                disabled={viewMode === "details"}
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Ngày xuất
                            </label>
                            <DatePickerOne disabled={viewMode === "details"} />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Xuất hàng cho <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập nơi xuất hàng"
                                disabled={viewMode === "details"}
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Lí do xuất hàng
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập lí do xuất hàng"
                                disabled={viewMode === "details"}
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Địa chỉ xuất hàng <span className="text-meta-1">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ xuất hàng"
                            disabled={viewMode === "details"}
                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Danh sách sản phẩm</h3>
                </div>
                <div className="p-6.5">
                    {viewMode !== "details" && (
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <label className="mb-3 block self-center whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                Tên sản phẩm <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên sảm phẩm"
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            <IconButton icon={<FaPlus />} onClick={(e) => addItem(e)} />
                        </div>
                    )}
                    <ProductsTable data={products} active={viewMode !== "details"} setProducts={setProducts} />

                    {viewMode !== "details" && (
                        <button
                            className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                            type="submit"
                        >
                            {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default InboundForm;

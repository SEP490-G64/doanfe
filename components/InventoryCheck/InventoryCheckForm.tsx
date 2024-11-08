"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { TfiSupport } from "react-icons/tfi";

import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import ProductsTable from "@/components/Tables/ProductsTableBeforeCheck";
import IconButton from "@/components/UI/IconButton";
import { ProductInfor } from "@/types/inbound";

const InventoryCheckForm = ({
    viewMode,
    inventoryCheckId,
}: {
    viewMode: "details" | "update" | "create";
    inventoryCheckId?: string;
}) => {
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
            {/* <!--  Thông tin người duyệt --> */}
            {viewMode !== "create" && (
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-6.5">
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <div className="flex w-full items-center gap-2 xl:w-1/2">
                                <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                    Người duyệt: <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập người duyệt"
                                    disabled={viewMode === "details"}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="flex w-full items-center gap-2 xl:w-1/2">
                                <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                    Ngày duyệt: <span className="text-meta-1">*</span>
                                </label>
                                <DatePickerOne disabled={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* <!-- Input Fields --> */}
            <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Thông tin nhà cung cấp</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Người tạo <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập tên người tạo"
                                disabled={viewMode === "details"}
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Ngày tạo
                            </label>
                            <DatePickerOne disabled={viewMode === "details"} />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Chi nhánh <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={"Chi nhánh 2"}
                                disabled
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Mã đơn</label>
                            <input
                                type="text"
                                defaultValue={"KK-10012024"}
                                disabled
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Ghi chú <span className="text-meta-1">*</span>
                        </label>
                        <textarea
                            rows={5}
                            placeholder="Nhập ghi chú"
                            disabled={viewMode === "details"}
                            className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        ></textarea>
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

export default InventoryCheckForm;

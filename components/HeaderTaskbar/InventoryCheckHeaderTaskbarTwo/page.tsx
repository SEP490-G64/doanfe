"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaFileImport, FaPlus } from "react-icons/fa6";

import Button from "@/components/UI/Button";
import {
    getListProductByCheckExpiredDate,
    getListProductByCheckNonePrice,
    getListProductByCheckNumberOfExpiredDate,
    getListProductByCheckPrice,
    getListProductByCheckQuantity,
} from "@/services/productServices";
import { Product } from "@/types/product";

function HeaderTaskbar({
    sessionToken,
    setInventoryCheckData,
    loading,
    setLoading,
    page,
    setPage,
    pageSize,
    setTotal,
    filterMode,
    setFilterMode,
    selectedOptions,
    setSelectedOptions,
    lowQuantity,
    setLowQuantity,
    numberOfDates,
    setNumberOfDates,
    buttons,
}: {
    sessionToken: string;
    setInventoryCheckData: any;
    loading: boolean;
    setLoading: any;
    page: number;
    setPage: any;
    pageSize: number;
    setTotal: any;
    filterMode: "quantity" | "price" | "expireDate";
    setFilterMode: any;
    selectedOptions: {
        lowQuantity: boolean;
        warningQuantity: boolean;
        outOfStock: boolean;
        lostPrice: boolean;
        warningPrice: boolean;
        outExpireDate: boolean;
        lowExpireDate: boolean;
    };
    setSelectedOptions: any;
    lowQuantity: number;
    setLowQuantity: any;
    numberOfDates: number;
    setNumberOfDates: any;
    buttons?: string;
}) {
    const router = useRouter();

    const handleChangeOpts = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        if (name === "outExpireDate" && checked) {
            setSelectedOptions((prevState: any) => ({ ...prevState, lowExpireDate: false }));
        } else if (name === "lowExpireDate" && checked) {
            setSelectedOptions((prevState: any) => ({ ...prevState, outExpireDate: false }));
        } else if (name === "lostPrice" && checked) {
            setSelectedOptions((prevState: any) => ({ ...prevState, warningPrice: false }));
        } else if (name === "warningPrice" && checked) {
            setSelectedOptions((prevState: any) => ({ ...prevState, lostPrice: false }));
        }
        setSelectedOptions((prevState: any) => ({ ...prevState, [name]: checked }));
    };

    const handleChangeTabs = (index: number) => {
        if (index === 0) setFilterMode("quantity");
        else if (index === 1) setFilterMode("price");
        else setFilterMode("expireDate");
    };

    const getListProducts = async () => {
        if (loading) return;
        setLoading(true);
        try {
            let response;
            if (filterMode === "quantity") {
                response = await getListProductByCheckQuantity(
                    (page - 1).toString(),
                    pageSize.toString(),
                    selectedOptions.lowQuantity,
                    lowQuantity,
                    selectedOptions.warningQuantity,
                    selectedOptions.outOfStock,
                    sessionToken
                );

                if (response.message === "200 OK") {
                    setInventoryCheckData(
                        response.data.map((item: Product, index: number) => ({
                            ...item,
                            index: index + 1 + (page - 1) * pageSize,
                        }))
                    );
                    setTotal(response.total);
                }
            } else if (filterMode === "price") {
                if (selectedOptions.warningPrice) {
                    response = await getListProductByCheckPrice(
                        (page - 1).toString(),
                        pageSize.toString(),
                        sessionToken
                    );
                    if (response.message === "200 OK") {
                        setInventoryCheckData(
                            response.data.map((item: Product, index: number) => ({
                                ...item,
                                index: index + 1 + (page - 1) * pageSize,
                            }))
                        );
                        setTotal(response.total);
                    }
                } else if (selectedOptions.lostPrice) {
                    response = await getListProductByCheckNonePrice(
                        (page - 1).toString(),
                        pageSize.toString(),
                        sessionToken
                    );
                    if (response.message === "200 OK") {
                        setInventoryCheckData(
                            response.data.map((item: Product, index: number) => ({
                                ...item,
                                index: index + 1 + (page - 1) * pageSize,
                            }))
                        );
                        setTotal(response.total);
                    }
                }
            } else if (filterMode === "expireDate") {
                if (selectedOptions.lowExpireDate) {
                    response = await getListProductByCheckNumberOfExpiredDate(
                        (page - 1).toString(),
                        pageSize.toString(),
                        numberOfDates,
                        sessionToken
                    );
                    if (response.message === "200 OK") {
                        setInventoryCheckData(
                            response.data.map((item: any, index: number) => ({
                                ...item,
                                index: index + 1 + (page - 1) * pageSize,
                            }))
                        );
                        setTotal(response.total);
                    }
                } else if (selectedOptions.outExpireDate) {
                    response = await getListProductByCheckExpiredDate(
                        (page - 1).toString(),
                        pageSize.toString(),
                        sessionToken
                    );
                    if (response.message === "200 OK") {
                        setInventoryCheckData(
                            response.data.map((item: any, index: number) => ({
                                ...item,
                                index: index + 1 + (page - 1) * pageSize,
                            }))
                        );
                        setTotal(response.total);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        try {
            setPage(() => 1);
            await getListProducts();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="mb-6 flex flex-col gap-3">
            {/* Dòng đầu tiên */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <button
                        className="absolute left-0 top-0 flex h-full items-center justify-center rounded bg-primary p-4 text-white hover:bg-blue-700"
                        onClick={handleSearch}
                    >
                        <svg
                            className="fill-white hover:fill-yellow-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                </div>

                {buttons === "import" && (
                    <Button label="Nhập file" size="small" icon={<FaFileImport />} type="success" onClick={() => {}} />
                )}
                <Button
                    label="Thêm mới"
                    size="small"
                    icon={<FaPlus />}
                    onClick={() => router.push("/inventory-check-note/create")}
                />
            </div>

            <div className="mt-4 flex flex-col space-y-4 rounded-lg bg-white p-4 shadow-lg">
                <Tabs
                    onSelect={(index) => handleChangeTabs(index)}
                    selectedIndex={filterMode === "quantity" ? 0 : filterMode === "price" ? 1 : 2}
                >
                    <TabList>
                        <Tab>Kiểm kê số lượng</Tab>
                        <Tab>Kiểm kê theo giá sản phẩm</Tab>
                        <Tab>Kiểm kê theo ngày hết hạn</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="lowQuantity"
                                    checked={selectedOptions.lowQuantity}
                                    onChange={handleChangeOpts}
                                    className="size-4 accent-primary"
                                />
                                <span>Số lượng còn ít hơn hoặc bằng</span>
                                <input
                                    type="text"
                                    value={lowQuantity.toLocaleString()}
                                    onChange={(e) => setLowQuantity(Number(e.target.value.replace(/,/g, "")))}
                                    className="border-gray-300 text-gray-700 w-32 rounded-md border p-1 shadow-sm focus:outline-none"
                                />
                            </label>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="warningQuantity"
                                    checked={selectedOptions.warningQuantity}
                                    onChange={handleChangeOpts}
                                    className="size-4 accent-primary"
                                />
                                <span>Chạm số lượng cảnh báo</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="outOfStock"
                                    checked={selectedOptions.outOfStock}
                                    onChange={handleChangeOpts}
                                    className="size-4 accent-primary"
                                />
                                <span>Số lượng đã hết</span>
                            </label>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {/* Kiểm kê giá sản phẩm */}
                        <div className="flex items-center gap-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="warningPrice"
                                    checked={selectedOptions.warningPrice}
                                    onChange={handleChangeOpts}
                                    className="size-4 accent-primary"
                                />
                                <span>Giá bán nhỏ hơn giá nhập</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="lostPrice"
                                    checked={selectedOptions.lostPrice}
                                    onChange={handleChangeOpts}
                                    className="size-4 accent-primary"
                                />
                                <span>Chưa có giá bán</span>
                            </label>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        {/* Kiểm kê ngày hết hạn */}
                        <div className="flex space-y-4">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="outExpireDate"
                                        checked={selectedOptions.outExpireDate}
                                        onChange={handleChangeOpts}
                                        className="size-4 accent-primary"
                                    />
                                    <span>Sản phẩm đã hết hạn</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="lowExpireDate"
                                        checked={selectedOptions.lowExpireDate}
                                        onChange={handleChangeOpts}
                                        className="size-4 accent-primary"
                                    />
                                    <span>Sản phẩm hết hạn trong</span>
                                    <input
                                        type="text"
                                        value={numberOfDates.toLocaleString()}
                                        onChange={(e) => setNumberOfDates(Number(e.target.value.replace(/,/g, "")))}
                                        className="border-gray-300 text-gray-700 w-24 rounded-md border p-1 shadow-sm focus:outline-none"
                                    />
                                    <span>ngày</span>
                                </label>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}

export default HeaderTaskbar;

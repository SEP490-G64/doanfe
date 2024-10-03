"use client";
import React from "react";

import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { Radio, RadioGroup } from "@nextui-org/radio";
import { toast } from "react-toastify";

const BranchForm = ({ viewMode }: { viewMode: "details" | "update" | "create" }) => {
    const handleOnClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast.success("Ok roi!");
    };

    return (
        <div className="flex flex-col gap-9">
            {/* <!-- Contact Form --> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <form action="#">
                    <div className="p-6.5">
                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Tên chi nhánh <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Nhập tên chi nhánh"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Địa chỉ <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập địa chỉ"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Người liên hệ
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên người liên hệ"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập số điện thoại người liên hệ"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/3">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Kiểu chi nhánh
                                </label>
                                <RadioGroup>
                                    <div className="flex flex-row gap-3 mt-3">
                                        <Radio value="buenos-aires">Trụ sở chính</Radio>
                                        <Radio value="sydney">Chi nhánh</Radio>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="w-full xl:w-1/3">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Quy mô
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập quy mô"
                                    className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="w-full xl:w-1/3">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Trạng thái hoạt động
                                </label>
                                <SwitcherThree />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Mô tả ngắn
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Nhập mô tả ngắn"
                                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            ></textarea>
                        </div>

                        {viewMode !== "details" && (
                            <button
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                                onClick={(e) => handleOnClick(e)}
                            >
                                {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchForm;

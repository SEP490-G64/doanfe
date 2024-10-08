"use client";
import React, { useEffect, useState } from "react";

import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BranchBody, BranchBodyType } from "@/lib/schemaValidate/branchSchema";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { createBranch, getBranchById, updateBranch } from "@/services/branchServices";
import Loader from "@/components/common/Loader";

const BranchForm = ({ viewMode, branchId }: { viewMode: "details" | "update" | "create"; branchId?: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BranchBodyType>({
        resolver: zodResolver(BranchBody),
        defaultValues: {
            branchName: undefined,
            location: undefined,
            contactPerson: undefined,
            phoneNumber: undefined,
            branchType: undefined,
            capacity: undefined,
            activeStatus: undefined,
        },
    });

    const getBranchInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getBranchById(branchId as string, sessionToken);

            if (response.message === "200 OK") {
                const fields: [
                    "branchName",
                    "location",
                    "contactPerson",
                    "phoneNumber",
                    "branchType",
                    "capacity",
                    "activeStatus",
                ] = [
                    "branchName",
                    "location",
                    "contactPerson",
                    "phoneNumber",
                    "branchType",
                    "capacity",
                    "activeStatus",
                ];

                fields.forEach((field) => setValue(field, response.data[field]));
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (viewMode != "create") {
            getBranchInfo();
        }
    }, []);

    const onSubmit = async (branch: BranchBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createBranch(branch, sessionToken);
            else response = await updateBranch(branch, branchId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push("/branches/list");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    else
        return (
            <div className="flex flex-col gap-9">
                {/* <!-- Contact Form --> */}
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Tên chi nhánh <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập tên chi nhánh"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("branchName")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.branchName && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.branchName.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Địa chỉ <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập địa chỉ"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("location")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.location && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.location.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Người liên hệ
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên người liên hệ"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("contactPerson")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.contactPerson && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.contactPerson.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Số điện thoại <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số điện thoại người liên hệ"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("phoneNumber")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.phoneNumber && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.phoneNumber.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/3">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Kiểu chi nhánh <span className="text-meta-1">*</span>
                                    </label>
                                    <div className="mt-6 flex flex-row gap-3">
                                        <label>
                                            <input
                                                type="radio"
                                                {...register("branchType")}
                                                value="Trụ sở chính"
                                                className="mr-2"
                                                disabled={viewMode === "details"}
                                            />
                                            Trụ sở chính
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                {...register("branchType")}
                                                value="Chi nhánh"
                                                className="mr-2"
                                                disabled={viewMode === "details"}
                                            />
                                            Chi nhánh
                                        </label>
                                    </div>
                                    {errors.branchType && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.branchType.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/3">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Quy mô
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Nhập quy mô"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("capacity")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.capacity && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.capacity.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/3">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Trạng thái hoạt động
                                    </label>
                                    <SwitcherThree
                                        register={{ ...register("activeStatus") }}
                                        watch={watch}
                                        setValue={setValue}
                                        disabled={viewMode === "details"}
                                    />
                                </div>
                            </div>

                            {viewMode !== "details" && (
                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
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

"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { BranchBody, BranchBodyType } from "@/lib/schemaValidate/branchSchema";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { createBranch, getBranchById, updateBranch } from "@/services/branchServices";
import Loader from "@/components/common/Loader";
import Unauthorized from "@/components/common/Unauthorized";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";

const BranchForm = ({ viewMode, branchId }: { viewMode: "details" | "update" | "create"; branchId?: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();
    const [formattedCapacity, setFormattedCapacity] = useState("");

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

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
            activeStatus: true,
            isDeleted: false
        },
    });

    const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, ""); // Loại bỏ dấu phẩy
        const numericValue = parseInt(rawValue, 10) || 0; // Chuyển đổi thành số
        setFormattedCapacity(numericValue.toLocaleString()); // Định dạng với dấu phẩy
        setValue("capacity", numericValue); // Lưu giá trị không định dạng vào react-hook-form
    };

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

                setFormattedCapacity(response.data.capacity.toLocaleString());
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
    else {
        if (!userInfo?.roles?.some(role => role.type === 'ADMIN')) {
            return (
                <Unauthorized></Unauthorized>
            );
        }
        else {
            return (
                <div className="flex flex-col gap-9">
                    {/* <!-- Contact Form --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate method={"post"}>
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
                                                    value="MAIN"
                                                    className="mr-2"
                                                    disabled={viewMode === "details"}
                                                />
                                                Trụ sở chính
                                            </label>
                                            <label>
                                                <input
                                                    type="radio"
                                                    {...register("branchType")}
                                                    value="SUB"
                                                    className="mr-2"
                                                    defaultChecked={viewMode === "create"}
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
                                            type="text"
                                            placeholder="Nhập quy mô"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            value={formattedCapacity} // Hiển thị giá trị định dạng
                                            onChange={handleCapacityChange} // Xử lý định dạng khi thay đổi
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

                                <div className="flex flex-col items-center gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        {viewMode !== "details" && (
                                            <button
                                                className="flex w-full justify-center rounded border border-primary bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                                type="submit"
                                            >
                                                {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                                            </button>
                                        )}
                                        {viewMode === "details" && (
                                            <button
                                                className="flex w-full justify-center rounded border border-primary bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                                type={"button"}
                                                onClick={() => router.push(`/branches/update/${branchId}`)}
                                            >
                                                Đi đến cập nhật
                                            </button>
                                        )}
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        {viewMode !== "details" && (
                                            <button
                                                className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                                type={"button"}
                                                onClick={() => onOpenChange()}
                                            >
                                                Hủy
                                            </button>
                                        )}
                                        {viewMode === "details" && (
                                            <button
                                                className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                                type={"button"}
                                                onClick={() => router.push(`/branches/list`)}
                                            >
                                                Quay lại danh sách
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                    <ModalBody>
                                        <p>Bạn có chắc muốn hủy thực hiện hành động này không?</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="default" variant="light" onPress={onClose}>
                                            Không
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={() => {
                                                router.push(`/branches/list`);
                                                onClose();
                                            }}
                                        >
                                            Chắc chắn
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            );
        }
    }
};

export default BranchForm;

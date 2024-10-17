"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { SupplierBody, SupplierBodyType } from "@/lib/schemaValidate/supplierSchema";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { createSupplier, getSupplierById, updateSupplier } from "@/services/supplierServices";
import Loader from "@/components/common/Loader";
import SwitcherStatus from "@/components/Switchers/SwitcherStatus";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

const SupplierForm = ({ viewMode, supplierId }: { viewMode: "details" | "update" | "create"; supplierId?: string }) => {
    const { isOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<SupplierBodyType>({
        resolver: zodResolver(SupplierBody),
        defaultValues: {
            supplierName: undefined,
            address: undefined,
            email: undefined,
            phoneNumber: undefined,
            taxCode: undefined,
            faxNumber: undefined,
            status: undefined,
        },
    });

    const getSupplierInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getSupplierById(supplierId as string, sessionToken);

            if (response.message === "200 OK") {
                const fields: ["supplierName", "address", "email", "phoneNumber", "taxCode", "faxNumber", "status"] = [
                    "supplierName",
                    "address",
                    "email",
                    "phoneNumber",
                    "taxCode",
                    "faxNumber",
                    "status",
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
        setValue("status", true);
        if (viewMode != "create") {
            getSupplierInfo();
        }
    }, []);

    const onSubmit = async (supplier: SupplierBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createSupplier(supplier, sessionToken);
            else response = await updateSupplier(supplier, supplierId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push("/suppliers/list");
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
                                    Tên nhà cung cấp <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập tên nhà cung cấp"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("supplierName")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.supplierName && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.supplierName.message}
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
                                    {...register("address")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.address && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.address.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Mã số thuế
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập mã số thuế"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("taxCode")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.taxCode && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.taxCode.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Số điện thoại <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số điện thoại"
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
                                <div className="w-full xl:w-2/5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập email"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("email")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.email && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-2/5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Số fax
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số fax"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("faxNumber")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.faxNumber && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.faxNumber.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Trạng thái hoạt động
                                    </label>
                                    <SwitcherStatus
                                        register={{ ...register("status") }}
                                        watch={watch}
                                        setValue={setValue}
                                        disabled={viewMode === "details"}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    {viewMode !== "details" && (
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            type="submit"
                                        >
                                            {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                                        </button>
                                    )}
                                    {viewMode == "details" && (
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            type={"button"}
                                            onClick={() => router.push(`/suppliers/update/${supplierId}`)}
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
                                    {viewMode == "details" && (
                                        <button
                                            className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                            type={"button"}
                                            onClick={() => router.push(`/suppliers/list`)}
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
                                        Hủy
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            router.push(`/suppliers/list`);
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
};

export default SupplierForm;

"use client";
import React, { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ManufacturerBody, ManufacturerBodyType } from "@/lib/schemaValidate/manufacturerSchema";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { createManufacturer, getManufacturerById, updateManufacturer } from "@/services/manufacturerServices";
import Loader from "@/components/common/Loader";
import SwitcherStatus from "@/components/Switchers/SwitcherStatus";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

const ManufacturerForm = ({
    viewMode,
    manufacturerId,
}: {
    viewMode: "details" | "update" | "create";
    manufacturerId?: string;
}) => {
    const { isOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState<string[]>([]); // Thêm state để lưu danh sách quốc gia
    const router = useRouter();
    const { sessionToken } = useAppContext();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ManufacturerBodyType>({
        resolver: zodResolver(ManufacturerBody),
        defaultValues: {
            manufacturerName: undefined,
            address: undefined,
            email: undefined,
            phoneNumber: undefined,
            taxCode: undefined,
            origin: undefined,
            status: undefined,
        },
    });

    const getManufacturerInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getManufacturerById(manufacturerId as string, sessionToken);

            if (response.message === "200 OK") {
                const fields: ["manufacturerName", "address", "email", "phoneNumber", "taxCode", "origin", "status"] = [
                    "manufacturerName",
                    "address",
                    "email",
                    "phoneNumber",
                    "taxCode",
                    "origin",
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

    // Hàm fetch danh sách quốc gia từ API
    const fetchCountries = async () => {
        try {
            const response = await fetch("http://api.geonames.org/countryInfoJSON?username=juncookie&lang=vi");
            const data = await response.json();

            // Lấy danh sách tên quốc gia từ dữ liệu
            const countryNames = data.geonames.map((country: any) => country.countryName);
            console.log(countryNames); // Kiểm tra danh sách tên quốc gia

            setCountries(countryNames); // Lưu danh sách quốc gia vào state
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu quốc gia:", error);
        }
    };

    useEffect(() => {
        fetchCountries(); // Gọi hàm fetch danh sách quốc gia khi component mount
        setValue("status", true);
        if (viewMode != "create") {
            getManufacturerInfo();
        }
    }, []);

    const onSubmit = async (manufacturer: ManufacturerBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createManufacturer(manufacturer, sessionToken);
            else response = await updateManufacturer(manufacturer, manufacturerId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push("/manufacturers/list");
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
                                    Tên nhà sản xuất <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập tên nhà sản xuất"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("manufacturerName")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.manufacturerName && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.manufacturerName.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Địa chỉ
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
                                        Số điện thoại
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
                                        Quốc gia <span className="text-meta-1">*</span>
                                    </label>
                                    <select
                                        {...register("origin")}
                                        value={watch("origin")} // Use watch to get the current value of origin
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        disabled={viewMode === "details"}
                                    >
                                        <option value="">Chọn quốc gia</option>
                                        {countries.map((country, index) => (
                                            <option key={index} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.origin && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.origin.message}
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
                                            onClick={() => router.push(`/manufacturers/update/${manufacturerId}`)}
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
                                            onClick={() => router.push(`/manufacturers/list`)}
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
                                            router.push(`/manufacturers/list`);
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

export default ManufacturerForm;
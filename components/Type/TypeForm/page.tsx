"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import { TypeBody, TypeBodyType } from "@/lib/schemaValidate/typeSchema";
import Loader from "@/components/common/Loader";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { createType, getTypeById, updateType } from "@/services/typeServices";

const TypeForm = ({ viewMode, typeId }: { viewMode: "details" | "update" | "create"; typeId?: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<TypeBodyType>({
        resolver: zodResolver(TypeBody),
        defaultValues: {
            typeName: undefined,
            typeDescription: undefined,
        },
    });

    const getTypeInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getTypeById(typeId as string, sessionToken);

            if (response.message === "200 OK") {
                const fields: ["typeName", "typeDescription"] = ["typeName", "typeDescription"];

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
            getTypeInfo();
        }
    }, []);

    const onSubmit = async (type: TypeBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createType(type, sessionToken);
            else response = await updateType(type, typeId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push("/types/list");
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
                    <form onSubmit={handleSubmit(onSubmit)} noValidate method={"post"}>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Tên loại sản phẩm <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập tên loại sản phẩm"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("typeName")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.typeName && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.typeName.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Mô tả
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập mô tả"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("typeDescription")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.typeDescription && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.typeDescription.message}
                                    </span>
                                )}
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
                                            onClick={() => router.push(`/types/update/${typeId}`)}
                                        >
                                            Đi đến cập nhật
                                        </button>
                                    )}
                                </div>
                                <div className="w-full xl:w-1/2">
                                    {viewMode === "details" && (
                                        <button
                                            className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                            type={"button"}
                                            onClick={() => router.push(`/types/list`)}
                                        >
                                            Quay lại danh sách
                                        </button>
                                    )}
                                    {viewMode !== "details" && (
                                        <button
                                            className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                            type={"button"}
                                            onClick={() => onOpenChange()}
                                        >
                                            Hủy
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
                                            router.push(`/types/list`);
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

export default TypeForm;

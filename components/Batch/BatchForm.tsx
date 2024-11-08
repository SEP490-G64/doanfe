"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import { BatchBody, BatchBodyType } from "@/lib/schemaValidate/batchSchema";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { createBatch, getBatchById, updateBatch } from "@/services/batchServices";
import Loader from "@/components/common/Loader";
import Unauthorized from "@/components/common/Unauthorized";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import { Product } from "@/types/product";
import { getProductById } from "@/services/productServices";

const BatchForm = ({ viewMode, productId, batchId }: { viewMode: "details" | "update" | "create"; productId?: string; batchId?: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();
    const [product, setProduct] = useState<Product>();

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BatchBodyType>({
        resolver: zodResolver(BatchBody),
        defaultValues: {
            batchCode: undefined,
            produceDate: undefined,
            expireDate: undefined,
            inboundPrice: undefined,
            product: undefined,
        },
    });

    const getBatchInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getBatchById(batchId as string, sessionToken);

            if (response.message === "200 OK") {
                const fields: [
                    "batchCode",
                    "produceDate",
                    "expireDate",
                    "inboundPrice",
                    "product",
                ] = [
                    "batchCode",
                    "produceDate",
                    "expireDate",
                    "inboundPrice",
                    "product",
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
            getBatchInfo();
        }
        getProductInfo();
    }, []);

    const onSubmit = async (Batch: BatchBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }

        console.log(Batch)

        if (productId) {
            Batch.product.id = productId;
        } else {
            throw new Error("productId không được xác định.");
        }

        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createBatch(Batch, sessionToken);
            else response = await updateBatch(Batch, batchId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push(`/products/batches/${productId}`);
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getProductInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getProductById(productId as string, sessionToken);

            if (response.message === "200 OK") {
                setProduct(response.data);
            } else router.push("/not-found");
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
                                        Mã lô <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Nhập mã lô"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("batchCode")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.batchCode && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.batchCode.message}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Ngày sản xuất
                                        </label>
                                        <DatePickerOne {...register("produceDate")} />
                                        {errors.produceDate && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.produceDate.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Ngày hết hạn <span className="text-meta-1">*</span>
                                        </label>
                                        <DatePickerOne {...register("expireDate")} />
                                        {errors.expireDate && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.expireDate.message}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Giá nhập lô
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập giá nhập lô"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            {...register("inboundPrice")}
                                            disabled={viewMode === "details"}
                                        />
                                        {errors.inboundPrice && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.inboundPrice.message}
                                            </span>
                                        )}
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc sản phẩm <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            value={product?.productName}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            {...register("product.productName")}
                                            disabled={viewMode === "details"}
                                        />
                                        {errors.product?.productName && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.product?.productName.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div hidden>
                                    <div className="mt-6 flex flex-row gap-3">
                                        <input
                                            value={product?.id}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            {...register("product.id")}
                                            disabled={viewMode === "details"}
                                        />
                                    </div>
                                    {errors.product?.id && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.product?.id.message}
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
                                                onClick={() =>
                                                    router.push(`/products/batches/${productId}/update/${batchId}`)
                                                }
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
                                                onClick={() => router.push(`/products/batches/${productId}`)}
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
                                                router.push(`/products/batches/${productId}`);
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

export default BatchForm;

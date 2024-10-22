"use client";

import React, {useState} from "react";

import { useRouter } from "next/navigation";
import { useAppContext } from "../AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import {
    ChangePasswordBody,
    ChangePasswordBodyType
} from "@/lib/schemaValidate/profileSchema";
import {changePassword} from "@/services/profileServices";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";

function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ChangePasswordBodyType>({
        resolver: zodResolver(ChangePasswordBody),
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (changePasswordBody: ChangePasswordBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await changePassword(changePasswordBody, sessionToken);

            if (response && !response.errors) {
                router.push("/profile");
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
            <>
                <div className="flex flex-col gap-9">
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Mật khẩu cũ <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu cũ"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("oldPassword")}
                                    />
                                    {errors.oldPassword && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.oldPassword.message}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Mật khẩu mới <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu mới"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("newPassword")}
                                    />
                                    {errors.newPassword && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.newPassword.message}
                                        </span>
                                    )}
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Mật khẩu xác nhận <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Nhập mật khẩu xác nhận"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("confirmPassword")}
                                    />
                                    {errors.confirmPassword && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.confirmPassword.message}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            type="submit"
                                        >
                                            Lưu
                                        </button>
                                    </div>
                                    <div className="w-full xl:w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                            type={"button"}
                                            onClick={() => onOpenChange()}
                                        >
                                            Hủy
                                        </button>
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
                                                router.push(`/profile`);
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
            </>
        );
}

export default ChangePasswordForm;
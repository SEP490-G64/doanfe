"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserBody, UserBodyType } from "@/lib/schemaValidate/userSchema";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import SwitcherStatus from "@/components/Switchers/SwitcherStatus";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { createUser, getUserById, updateUser } from "@/services/userServices";
import { getListBranch } from "@/services/branchServices";
import { array, object, string, z} from "zod";

const SupplierForm = ({ viewMode, userId }: { viewMode: "details" | "update" | "create"; userId?: string }) => {
    const { isOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { branches};

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<UserBodyType>({
        resolver: zodResolver(UserBody),
        defaultValues: {
            userName: undefined,
            email: undefined,
            phone: undefined,
            firstName: undefined,
            lastName: undefined,
            status: undefined,
            branch: undefined,
            roles: undefined
        },
    });

    const getUserInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getUserById(userId as string, sessionToken);
            console.log(response)

            if (response.message === "200 OK") {
                const fields: ["userName", "email", "phone", "firstName", "lastName", "status", "roles", "branch"] = [
                    "userName",
                    "email",
                    "phone",
                    "firstName",
                    "lastName",
                    "status",
                    "roles",
                    "branch"
                ];

                fields.forEach((field) => branchessetValue(field, response.data[field]));
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getBranches = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getListBranch(0, 10, sessionToken);
            console.log(response)

            if (response.message === "200 OK") {
                const fields: ["location"] = [
                    "location",
                ];


            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (viewMode != "create") {
            getUserInfo();
            getBranches();
        }
    }, []);

    const onSubmit = async (user: UserBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createUser(user, sessionToken);
            else response = await updateUser(user, userId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push("/users/list");
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
                                    Tên người dùng <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập tên người dùng"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("userName")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.userName && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.userName.message}
                                    </span>
                                )}
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Họ <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ"
                                        className="rounded border-1.5 w-full border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("firstName")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.firstName && (
                                        <span className="mt-1 block text-sm text-rose-500">
                                            {errors.firstName.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Tên <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên"
                                        className="rounded border-1.5 w-full border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("lastName")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.lastName && (
                                        <span className="mt-1 block text-sm text-rose-500">
                                            {errors.lastName.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
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

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Số điện thoại <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("phone")}
                                        disabled={viewMode === "details"}
                                    />
                                    {errors.phone && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.phone.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Vai Trò</label>
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("roles.${0}.type")} disabled={viewMode === "details"}>
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="MANAGER">MANAGER</option>
                                        <option value="STAFF">STAFF</option>
                                        <option value="UNDEFINE">UNDEFINE</option>
                                    </select>
                                </div>
                                <div className="w-full xl:w-1/2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Trạng thái hoạt động</label>
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" {...register("status")} disabled={viewMode === "details"}>
                                        <option value="ACTIVATE">ACTIVATE</option>
                                        <option value="DEACTIVATE">DEACTIVATE</option>
                                        <option value="PENDING">PENDING</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Làm việc tại chi nhánh <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập tên chi nhánh"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("branch.location")}
                                    disabled={viewMode === "details"}
                                />
                                {errors.branch && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.branch?.message}
                                    </span>
                                )}
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
                                            onClick={() => router.push(`/users/update/${userId}`)}
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
                                            onClick={() => router.push(`/users/list`)}
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
                                            router.push(`/users/list`);
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

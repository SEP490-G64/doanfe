"use client";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserBody, UserBodyType } from "@/lib/schemaValidate/userSchema";
import { useRouter } from "next/navigation";
import { FaStore, FaUserCheck } from "react-icons/fa";

import { useAppContext } from "@/components/AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { createUser, getUserById, updateUser } from "@/services/userServices";
import { getListBranch } from "@/services/branchServices";
import {Branch} from "@/types/branch";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";
import { DataSearch } from "@/types/product";
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";

const UserForm = ({
    viewMode,
    userId,
}: {
    viewMode: "details" | "update" | "create" | "reject" | "approve";
    userId?: string;
}) => {
    const { isOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [status, setStatus] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [dataSearch, setDataSearch] = useState<DataSearch>({
        keyword: "",
        status: "",
    });

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const roleOptions = [
        { value: 3, label: "ADMIN" },
        { value: 2, label: "MANAGER" },
        { value: 1, label: "STAFF" },
    ];

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
            status: "ACTIVATE",
            branch: undefined,
            roles: undefined,
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
            console.log(response);

            if (response.message === "200 OK") {
                const fields: ["userName", "email", "phone", "firstName", "lastName", "status", "roles", "branch"] = [
                    "userName",
                    "email",
                    "phone",
                    "firstName",
                    "lastName",
                    "status",
                    "roles",
                    "branch",
                ];

                fields.forEach((field) => setValue(field, response.data[field]));
                setStatus(response.data["status"]);
                setRole(response.data[`roles.${0}.type`]);
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getBranches = async () => {
        try {
            const response = await getListBranch("0", "10", dataSearch, sessionToken);

            setBranches(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách :", error);
        }
    };

    useEffect(() => {
        getBranches();
        if (viewMode != "create") {
            getUserInfo();
        }
        if (viewMode === "create") {
            setValue("status", "ACTIVATE"); // Đảm bảo status có giá trị mặc định
        }
    }, []);

    const onSubmit = async (user: UserBodyType) => {
        console.log("Submit button clicked!");
        console.log(user);

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
                if (viewMode !== "approve") {
                    router.push("/users/list");
                    router.refresh();
                }
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
        return (
            <div className="flex flex-col gap-9">
                {/* <!-- Contact Form --> */}
                <div
                    className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit(onSubmit)} noValidate method={"post"}>
                        <div className="p-6.5">
                            <div className="mb-4.5" hidden={viewMode === "approve" || viewMode === "reject"}>
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Tên người dùng <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập tên người dùng"
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    {...register("userName")}
                                    disabled={viewMode !== "create" && viewMode !== "update"}
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
                                        Họ
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập họ"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("firstName")}
                                        disabled={viewMode !== "create" && viewMode !== "update"}
                                    />
                                    {errors.firstName && (
                                        <span className="mt-1 block text-sm text-rose-500">
                                            {errors.firstName.message}
                                        </span>
                                    )}
                                </div>

                                <div className="w-full xl:w-1/2">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("lastName")}
                                        disabled={viewMode !== "create" && viewMode !== "update"}
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
                                        Email <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập email"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("email")}
                                        disabled={viewMode !== "create" && viewMode !== "update"}
                                    />
                                    {errors.email && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.email.message}
                                        </span>
                                    )}
                                </div>

                                <div
                                    className="w-full xl:w-1/2"
                                    hidden={viewMode === "approve" || viewMode === "reject"}
                                >
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập số điện thoại"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("phone")}
                                        disabled={viewMode !== "create" && viewMode !== "update"}
                                    />
                                    {errors.phone && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.phone.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div
                                    className="w-full xl:w-1/2"
                                    hidden={viewMode === "approve" || viewMode === "reject"}
                                >
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Vai Trò <span className="text-meta-1">*</span>
                                    </label>
                                    <SelectGroupTwo
                                        icon={<FaUserCheck />}
                                        placeholder={"Chọn vai trò"}
                                        register={{ ...register(`roles.${0}.id`) }}
                                        watch={watch(`roles.${0}.id`)}
                                        data={roleOptions}
                                    />

                                    {errors.roles?.[0]?.id && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.roles[0].id.message}
                                        </span>
                                    )}
                                </div>
                                <div
                                    className="w-full xl:w-1/2"
                                    hidden={viewMode === "approve" || viewMode === "reject"}
                                >
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Trạng thái hoạt động <span className="text-meta-1">*</span>
                                    </label>
                                    {(() => {
                                        if (status === "REJECTED") {
                                            return (
                                                <input
                                                    type="text"
                                                    value={"Từ chối"}
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    {...register("status")}
                                                    disabled
                                                />
                                            );
                                        } else {
                                            return (
                                                <>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            {...register("status")}
                                                            value="ACTIVATE"
                                                            className="mr-2"
                                                            defaultChecked={viewMode === "create"}
                                                            disabled={viewMode !== "update"}
                                                        />
                                                        Kích hoạt
                                                    </label>
                                                    {"   "}
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            {...register("status")}
                                                            value="DEACTIVATE"
                                                            className="mr-2"
                                                            disabled={viewMode !== "update"}
                                                        />
                                                        Vô hiệu hóa
                                                    </label>
                                                </>
                                            );
                                        }
                                    })()}
                                </div>
                            </div>

                            <div className="mb-4.5" hidden={viewMode === "reject"}>
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Làm việc tại chi nhánh <span className="text-meta-1">*</span>
                                </label>
                                <SelectGroupTwo
                                    icon={<FaStore />}
                                    placeholder={"Chọn chi nhánh làm việc"}
                                    register={{ ...register("branch.id") }}
                                    watch={watch("branch.id")}
                                    disabled={viewMode !== "create" && viewMode !== "update" && viewMode !== "approve"}
                                    data={
                                        branches.map((branch) => ({
                                            label: branch.branchName,
                                            value: branch.id.toString(),
                                        })) as { label: string; value: string }[]
                                    }
                                />

                                {errors.branch?.id && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.branch?.id.message}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-6 xl:flex-row">
                                <div className="w-full xl:w-1/2">
                                    {viewMode !== "details" && viewMode !== "reject" && status !== "REJECTED" && (
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            type="submit"
                                            onClick={() => console.log(errors)}
                                        >
                                            {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                                        </button>
                                    )}
                                    {viewMode === "details" && status !== "REJECTED" && (
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            type={"button"}
                                            hidden
                                            onClick={() => router.push(`/users/update/${userId}`)}
                                        >
                                            Đi đến cập nhật
                                        </button>
                                    )}
                                </div>
                                <div className="w-full xl:w-1/2">
                                    {viewMode !== "details" && viewMode !== "approve" && viewMode !== "reject" && (
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
    }
};

export default UserForm;

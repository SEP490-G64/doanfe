"use client";

import React, {useEffect, useState} from "react";

import { useRouter } from "next/navigation";
import { useAppContext } from "../AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import { useForm } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import {ProfileBody, ProfileBodyType} from "@/lib/schemaValidate/profileSchema";
import {getProfile, updateProfile} from "@/services/profileServices";
import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@nextui-org/react";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";

function UpdateProfileForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();
    const [user, setUser] = useState<ProfileBodyType | undefined>(undefined);

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ProfileBodyType>({
        resolver: zodResolver(ProfileBody),
        defaultValues: {
            email: undefined,
            userName: undefined,
            firstName: undefined,
            lastName: undefined,
            phone: undefined,
        },
    });

    const getProfileDetails = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getProfile(sessionToken);
            console.log(response);
            if (response.message === "200 OK") {
                setUser(response.data);

                const fields: ["email", "userName", "firstName", "lastName", "phone"] = [
                    "email",
                    "userName",
                    "firstName",
                    "lastName",
                    "phone"
                ];
                fields.forEach((field) => {
                    setValue(field, response.data[field]);
                });
            } else {
                router.push("/not-found");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProfileDetails();
    }, []);

    const onSubmit = async (profile: ProfileBodyType) => {

        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await updateProfile(profile, sessionToken);

            if (response && response.message === "200 OK") {
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
    else {
        if (!userInfo) {
            return (
                <Unauthorized></Unauthorized>
            );
        }
        return (
            <>
                <div className="text-center">
                    <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                        {user?.userName}
                    </h3>
                    <p className="font-medium">{user?.roles && user.roles.length > 0 ? user.roles[0].type : "No role assigned"}</p>
                </div>
                <div className="flex flex-col gap-9">
                    <div
                        className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <form onSubmit={handleSubmit(onSubmit)} noValidate method={"post"}>
                            <div className="p-6.5">
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Tên người dùng <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Nhập tên người dùng"
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        {...register("userName")}
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
                                        />
                                        {errors.firstName && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
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
                                        />
                                        {errors.lastName && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
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
                                            type="email"
                                            placeholder="Nhập email"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.email.message}
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
                                            {...register("phone")}
                                        />
                                        {errors.phone && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.phone.message}
                                        </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Nhân viên
                                        tại {user?.branch?.branchType == "MAIN" ? "Trụ sở chính" : "Chi nhánh"} {" "}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={user?.branch?.branchName + " - " + user?.branch?.location}
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            type={"submit"}
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
}

export default UpdateProfileForm;
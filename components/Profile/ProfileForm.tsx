"use client";

import React, {useEffect, useState} from "react";

import { useRouter } from "next/navigation";
import { useAppContext } from "../AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import Image from "next/image";
import {toast} from "react-toastify";
import {getProfile} from "@/services/profileServices";
import {ProfileBody, ProfileBodyType} from "@/lib/schemaValidate/profileSchema";

function ProfileForm() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const [user, setUser] = useState<ProfileBodyType | undefined>(undefined);
    
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

    if (loading) return <Loader />;
    else
        return (
            <>
                <div className="relative z-20 h-35 md:h-65">
                    <Image
                        src={"/images/cover/cover-01.png"}
                        alt="profile cover"
                        className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
                        width={970}
                        height={260}
                        style={{
                            width: "auto",
                            height: "auto",
                        }}
                    />
                    <div className="absolute bottom-1 right-1 z-10 xsm:bottom-4 xsm:right-4">
                        <button
                            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                            type={"button"}
                            onClick={() => router.push(`/profile/change-password`)}>
                            <span>Đổi mật khẩu</span>
                        </button>
                    </div>
                    <div className="absolute bottom-1 right-1 z-10 xsm:bottom-12 xsm:right-4">
                        <button
                            className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
                            type={"button"}
                            onClick={() => router.push(`/profile/update`)}>
                            <span>Cập nhật hồ sơ</span>
                        </button>
                    </div>
                </div>
                <div className="px-4 pb-6 lg:pb-8 xl:pb-11.5">
                    <div
                        className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
                        <div className="relative drop-shadow-2">
                            <Image
                                src={"/images/wlp-images/avatar.png"}
                                width={160}
                                height={160}
                                style={{
                                    width: "auto",
                                    height: "auto",
                                }}
                                alt="profile"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="text-center">
                            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                                {user?.userName}
                            </h3>
                            <p className="font-medium">{user?.roles && user.roles.length > 0 ? user.roles[0].type : "No role assigned"}</p>
                        </div>
                        <div
                            className="flex flex-col gap-1 border-r border-stroke px-4 xsm:flex-row dark:border-strokedark">
                            <h4 className="font-semibold text-black dark:text-white">Thông tin cá nhân</h4>
                        </div>
                        <div
                            className="max-w-105 mx-auto mb-9.5 mt-4.5 grid grid-cols-[2fr_3fr] rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                            <div className="gap-1 border-r border-stroke px-4 dark:border-strokedark text-right">
                                <span className="font-semibold text-black dark:text-white">Họ và tên </span>
                            </div>
                            <div className="gap-1 border-r border-stroke px-4 dark:border-strokedark">
                                {user?.firstName} {user?.lastName}
                            </div>
                            <div className="gap-1 border-r border-stroke px-4 dark:border-strokedark text-right">
                                <span className="font-semibold text-black dark:text-white">Email </span>
                            </div>
                            <div className="gap-1 border-r border-stroke px-4 dark:border-strokedark">
                                {user?.email}
                            </div>
                            <div className="gap-1 border-r border-stroke px-4 dark:border-strokedark text-right">
                                <span className="font-semibold text-black dark:text-white">Số điện thoại </span>
                            </div>
                            <div className="gap-1 border-r border-stroke px-4 dark:border-strokedark">
                                {user?.phone}
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-1 border-r border-stroke px-4 xsm:flex-row dark:border-strokedark">
                        <span className="font-semibold text-black dark:text-white">
                            Nhân viên tại {user?.branch?.branchType == "SUB" ? "Chi nhánh" : "Trụ sở chính"}{" "}
                        </span>
                            {user?.branch?.branchName} - {user?.branch?.location}
                        </div>
                    </div>
                </div>
            </>
        );
}

export default ProfileForm;
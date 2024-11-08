import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UpdateProfileForm from "@/components/Profile/UpdateProfileForm"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật hồ sơ cá nhân",
    description: "This is Next.js Update Profile Page TailAdmin Dashboard Template",
};

const Profile: React.FC = () => {
    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb pageName="Cập nhật hồ sơ cá nhân" />

                <div
                    className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                        <UpdateProfileForm/>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Profile;

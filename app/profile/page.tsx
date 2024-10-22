import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileForm from "@/components/Profile/ProfileForm"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";

export const metadata: Metadata = {
    title: "Hồ sơ cá nhân",
    description: "This is Next.js Profile Details Page TailAdmin Dashboard Template",
};

const Profile: React.FC = () => {
    return (
        <DefaultLayout>
            <div className="mx-auto max-w-242.5">
                <Breadcrumb pageName="Hồ sơ cá nhân" />

                <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <ProfileForm />
                </div>
            </div>
        </DefaultLayout>
    );
};

export default Profile;

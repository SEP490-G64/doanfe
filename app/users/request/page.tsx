import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách yêu cầu đăng kí người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UserRequestTable = dynamic(() => import("@/components/User/UserRequestTable/page"), { ssr: false });

const RegistrationRequestList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách yêu cầu đăng kí người dùng" />

            <div className="flex flex-col gap-18">
                {/* eslint-disable-next-line react/jsx-no-undef */}
                <UserRequestTable />
            </div>
        </DefaultLayout>
    );
};

export default RegistrationRequestList;

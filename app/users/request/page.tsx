import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UserRequestTable from "@/components/User/UserRequestTable/page";

export const metadata: Metadata = {
    title: "Danh sách yêu cầu đăng kí người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

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

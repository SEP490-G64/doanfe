import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/UserHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UsersTable = dynamic(() => import("@/components/User/UserTable/page"), { ssr: false });

const UserList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách người dùng" />

            <UsersTable />
        </DefaultLayout>
    );
};

export default UserList;

import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/SupplierHeaderTaskbar/page";
import UsersTable from "@/components/User/UserTable/page";

export const metadata: Metadata = {
    title: "Danh sách người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UserList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách người dùng" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <UsersTable />
            </div>
        </DefaultLayout>
    );
};

export default UserList;

import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserForm from "@/components/User/UserForm/page";

export const metadata: Metadata = {
    title: "Thêm mới người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateUser = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới người dùng" />

            <UserForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateUser;

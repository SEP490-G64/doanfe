import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserForm from "@/components/User/UserForm/page";

export const metadata: Metadata = {
    title: "Cập nhật người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateSupplier = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhà cung cấp" />

            <UserForm viewMode="update" userId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateSupplier;

import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserForm from "@/components/User/UserForm/page";

export const metadata: Metadata = {
    title: "Chi tiết người dùng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UserDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết người dùng" />

            <UserForm viewMode="details" userId={params.id} />
        </DefaultLayout>
    );
};

export default UserDetails;

import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Thêm mới chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchForm = dynamic(() => import("@/components/Branch/BranchForm/page"), {
    ssr: false,
});

const BranchDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới chi nhánh" />

            <BranchForm viewMode="create" />
        </DefaultLayout>
    );
};

export default BranchDetails;

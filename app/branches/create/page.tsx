import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BranchForm from "@/components/Branch/BranchForm/page";

export const metadata: Metadata = {
    title: "Thêm mới chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới chi nhánh" />

            <BranchForm viewMode="create" />
        </DefaultLayout>
    );
};

export default BranchDetails;

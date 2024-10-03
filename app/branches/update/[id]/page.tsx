import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BranchForm from "@/components/Branch/BranchForm/page";

export const metadata: Metadata = {
    title: "Cập nhật chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật chi nhánh" />

            <BranchForm viewMode="update" />
        </DefaultLayout>
    );
};

export default BranchDetails;

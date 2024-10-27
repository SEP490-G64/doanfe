import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import BranchesTable from "@/components/Branch/BranchTable/page";

export const metadata: Metadata = {
    title: "Danh sách chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách chi nhánh" />

            <BranchesTable />
        </DefaultLayout>
    );
};

export default BranchList;

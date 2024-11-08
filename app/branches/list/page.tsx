import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchesTable = dynamic(() => import("@/components/Branch/BranchTable/page"), { ssr: false });

const BranchList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách chi nhánh" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <BranchesTable />
            </div>
        </DefaultLayout>
    );
};

export default BranchList;

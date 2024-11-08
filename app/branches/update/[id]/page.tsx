import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BranchForm from "@/components/Branch/BranchForm/page";

export const metadata: Metadata = {
    title: "Cập nhật chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật chi nhánh" />

            <BranchForm viewMode="update" branchId={params.id} />
        </DefaultLayout>
    );
};

export default dynamic(() => Promise.resolve(BranchDetails), { ssr: false });

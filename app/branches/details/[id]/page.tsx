import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BranchForm from "@/components/Branch/BranchForm/page";

export const metadata: Metadata = {
    title: "Chi tiết chi nhánh",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BranchDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết chi nhánh" />

            <BranchForm viewMode="details" branchId={params.id} />
        </DefaultLayout>
    );
};

export default BranchDetails;

import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Chi tiết nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const SupplierForm = dynamic(() => import("@/components/Supplier/SupplierForm/page"), {
    ssr: false,
});

const SupplierDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết nhà cung cấp" />

            <SupplierForm viewMode="details" supplierId={params.id} />
        </DefaultLayout>
    );
};

export default SupplierDetails;

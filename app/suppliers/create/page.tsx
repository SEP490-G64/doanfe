import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Thêm mới nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const SupplierForm = dynamic(() => import("@/components/Supplier/SupplierForm/page"), {
    ssr: false,
});

const CreateSupplier = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới nhà cung cấp" />

            <SupplierForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateSupplier;

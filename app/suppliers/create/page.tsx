import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SupplierForm from "@/components/Supplier/SupplierForm/page";

export const metadata: Metadata = {
    title: "Thêm mới nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateSupplier = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới nhà cung cấp" />

            <SupplierForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateSupplier;

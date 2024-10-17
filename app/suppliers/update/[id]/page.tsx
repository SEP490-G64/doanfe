import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SupplierForm from "@/components/Supplier/SupplierForm/page";

export const metadata: Metadata = {
    title: "Cập nhật nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateSupplier = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhà cung cấp" />

            <SupplierForm viewMode="update" supplierId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateSupplier;

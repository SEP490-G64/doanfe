import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const SuppliersTable = dynamic(() => import("@/components/Supplier/SupplierTable/page"), {
    ssr: false,
});

const SupplierList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhà cung cấp" />

            <SuppliersTable />
        </DefaultLayout>
    );
};

export default SupplierList;

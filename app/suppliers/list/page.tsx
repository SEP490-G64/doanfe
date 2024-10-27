import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SuppliersTable from "@/components/Supplier/SupplierTable/page";

export const metadata: Metadata = {
    title: "Danh sách nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const SupplierList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhà cung cấp" />

            <SuppliersTable />
        </DefaultLayout>
    );
};

export default SupplierList;

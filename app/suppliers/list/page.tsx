import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import SuppliersTable from "@/components/Tables/SuppliersTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/SupplierHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách nhà cung cấp",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const SupplierList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhà cung cấp" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <SuppliersTable />
            </div>
        </DefaultLayout>
    );
};

export default SupplierList;

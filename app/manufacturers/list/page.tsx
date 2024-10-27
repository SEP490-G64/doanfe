import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ManufacturersTable from "@/components/Manufacturer/ManufacturerTable/page";

export const metadata: Metadata = {
    title: "Danh sách nhà sản xuất",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManufacturerList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhà sản xuất" />

            <ManufacturersTable />
        </DefaultLayout>
    );
};

export default ManufacturerList;

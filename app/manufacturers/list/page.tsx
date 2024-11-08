import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách nhà sản xuất",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManufacturersTable = dynamic(() => import("@/components/Manufacturer/ManufacturerTable/page"), { ssr: false });

const ManufacturerList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhà sản xuất" />

            <ManufacturersTable />
        </DefaultLayout>
    );
};

export default ManufacturerList;

import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ManufacturersTable from "@/components/Tables/ManufacturersTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/ManufacturerHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách nhà sản xuất",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManufacturerList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhà sản xuất" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <ManufacturersTable />
            </div>
        </DefaultLayout>
    );
};

export default ManufacturerList;

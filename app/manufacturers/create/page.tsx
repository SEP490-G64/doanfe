import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ManufacturerForm from "@/components/Manufacturer/ManufacturerForm/page";

export const metadata: Metadata = {
    title: "Thêm mới nhà sản xuất",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateManufacturer = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới nhà sản xuất" />

            <ManufacturerForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateManufacturer;

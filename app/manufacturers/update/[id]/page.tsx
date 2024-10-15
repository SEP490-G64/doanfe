import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ManufacturerForm from "@/components/Manufacturer/ManufacturerForm/page";

export const metadata: Metadata = {
    title: "Cập nhật nhà sản xuất",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateManufacturer = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhà sản xuất" />

            <ManufacturerForm viewMode="update" manufacturerId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateManufacturer;

import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật nhà sản xuất",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ManufacturerForm = dynamic(() => import("@/components/Manufacturer/ManufacturerForm/page"), {
    ssr: false,
});

const UpdateManufacturer = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhà sản xuất" />

            <ManufacturerForm viewMode="update" manufacturerId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateManufacturer;

import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Chi tiết vị trí lưu trữ",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const StorageLocationForm = dynamic(() => import("@/components/StorageLocation/StorageLocationForm/page"), { ssr: false });

const StorageLocationDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết vị trí lưu trữ" />

            <StorageLocationForm viewMode="details" StorageLocationId={params.id} />
        </DefaultLayout>
    );
};

export default StorageLocationDetails;

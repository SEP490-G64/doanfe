import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import StorageLocationForm from "@/components/StorageLocation/StorageLocationForm/page";

export const metadata: Metadata = {
    title: "Cập nhật vị trí lưu trữ",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const StorageLocationDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật vị trí lưu trữ" />

            <StorageLocationForm viewMode="update" StorageLocationId={params.id} />
        </DefaultLayout>
    );
};

export default dynamic(() => Promise.resolve(StorageLocationDetails), { ssr: false });

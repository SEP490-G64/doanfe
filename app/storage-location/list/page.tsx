import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách vị trí lưu trữ",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const StorageLocationTable = dynamic(() => import("@/components/StorageLocation/StorageLocationTable/page"), { ssr: false });

const StorageLocationList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách vị trí lưu trữ" />

            <StorageLocationTable />
        </DefaultLayout>
    );
};

export default StorageLocationList;

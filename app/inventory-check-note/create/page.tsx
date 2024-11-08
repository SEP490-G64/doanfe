import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Tạo mới phiếu kiểm kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryCheckForm = dynamic(() => import("@/components/InventoryCheck/InventoryCheckForm"), { ssr: false });

const CreateInventoryCheck = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Tạo mới phiếu kiểm kho" />

            <InventoryCheckForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateInventoryCheck;

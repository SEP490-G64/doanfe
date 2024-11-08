import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật phiếu kiểm kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryCheckForm = dynamic(() => import("@/components/InventoryCheck/InventoryCheckForm"), {
    ssr: false,
});

const UpdateInventoryCheck = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật phiếu kiểm kho" />

            <InventoryCheckForm viewMode="update" inventoryCheckId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateInventoryCheck;

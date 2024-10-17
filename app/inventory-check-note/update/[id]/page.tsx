import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InventoryCheckForm from "@/components/InventoryCheck/InventoryCheckForm";

export const metadata: Metadata = {
    title: "Cập nhật phiếu kiểm kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateInventoryCheck = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật phiếu kiểm kho" />

            <InventoryCheckForm viewMode="update" inventoryCheckId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateInventoryCheck;

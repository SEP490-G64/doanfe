import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InventoryCheckForm from "@/components/InventoryCheck/InventoryCheckForm";

export const metadata: Metadata = {
    title: "Chi tiết phiếu kiểm kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryCheckDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết phiếu kiểm kho" />

            <InventoryCheckForm viewMode="details" inventoryCheckId={params.id} />
        </DefaultLayout>
    );
};

export default InventoryCheckDetails;

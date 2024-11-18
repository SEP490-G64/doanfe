import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách phiếu kiểm kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryCheckTable = dynamic(() => import("@/components/InventoryCheck/InventoryCheckTable"), { ssr: false });

const InventoryCheckList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách phiếu kiểm kho" />

            <InventoryCheckTable />
        </DefaultLayout>
    );
};

export default InventoryCheckList;

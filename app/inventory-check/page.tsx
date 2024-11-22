import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Kiểm kê hàng hóa",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryCheck = dynamic(() => import("@/components/InventoryCheck/InventoryCheck"), { ssr: false });

const InventoryCheckList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Kiểm kê hàng hóa" />

            <InventoryCheck />
        </DefaultLayout>
    );
};

export default InventoryCheckList;

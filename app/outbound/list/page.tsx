import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách phiếu xuất hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const OutboundTable = dynamic(() => import("@/components/Outbound/OutboundTable"), { ssr: false });

const OutboundList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách phiếu xuất hàng" />

            <OutboundTable />
        </DefaultLayout>
    );
};

export default OutboundList;

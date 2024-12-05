import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";

export const metadata: Metadata = {
    title: "Báo cáo tồn kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryReportTable = dynamic(() => import("@/components/Report/InventoryReportTable"), { ssr: false });

const InventoryReport = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Báo cáo giá trị nhập - xuất" />

            <InventoryReportTable />
        </DefaultLayout>
    );
};

export default InventoryReport;

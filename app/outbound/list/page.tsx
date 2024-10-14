import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OutboundTable from "@/components/Outbound/OutboundTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách phiếu xuất hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const OutboundList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách phiếu xuất hàng" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <OutboundTable />
            </div>
        </DefaultLayout>
    );
};

export default OutboundList;

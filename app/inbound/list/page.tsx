import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InboundTable from "@/components/Inbound/InboundTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/InboundHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách phiếu nhập hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InboundList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách phiếu nhập hàng" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <InboundTable />
            </div>
        </DefaultLayout>
    );
};

export default InboundList;

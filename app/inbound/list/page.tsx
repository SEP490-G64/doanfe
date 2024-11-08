import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/InboundHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách phiếu nhập hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InboundTable = dynamic(() => import("@/components/Inbound/InboundTable"), { ssr: false });

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

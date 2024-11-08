import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Chi tiết phiếu xuất hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const OutboundForm = dynamic(() => import("@/components/Outbound/OutboundForm"), { ssr: false });

const OutboundDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết phiếu xuất hàng" />

            <OutboundForm viewMode="details" outboundId={params.id} />
        </DefaultLayout>
    );
};

export default OutboundDetails;

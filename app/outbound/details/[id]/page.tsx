import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OutboundForm from "@/components/Outbound/OutboundForm";

export const metadata: Metadata = {
    title: "Chi tiết phiếu xuất hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const OutboundDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết phiếu xuất hàng" />

            <OutboundForm viewMode="details" outboundId={params.id} />
        </DefaultLayout>
    );
};

export default OutboundDetails;

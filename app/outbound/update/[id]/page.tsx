import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OutboundForm from "@/components/Outbound/OutboundForm";

export const metadata: Metadata = {
    title: "Cập nhật phiếu xuất hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateOutbound = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật phiếu xuất hàng" />

            <OutboundForm viewMode="update" outboundId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateOutbound;

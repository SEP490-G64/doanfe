import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật phiếu nhập hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InboundForm = dynamic(() => import("@/components/Inbound/InboundForm"), { ssr: false });

const UpdateInbound = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật phiếu nhập hàng" />

            <InboundForm viewMode="update" inboundId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateInbound;

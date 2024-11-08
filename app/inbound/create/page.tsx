import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Tạo mới phiếu nhập hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InboundForm = dynamic(() => import("@/components/Inbound/InboundForm"), {
    ssr: false,
});

const CreateInbound = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Tạo mới phiếu nhập hàng" />

            <InboundForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateInbound;

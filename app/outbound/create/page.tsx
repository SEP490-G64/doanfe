import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import OutboundForm from "@/components/Outbound/OutboundForm";

export const metadata: Metadata = {
    title: "Tạo mới phiếu xuất hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateOutbound = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Tạo mới phiếu xuất hàng" />

            <OutboundForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateOutbound;

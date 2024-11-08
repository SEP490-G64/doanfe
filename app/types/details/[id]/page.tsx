import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Chi tiết loại sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TypeForm = dynamic(() => import("@/components/Type/TypeForm/page"), { ssr: false });

const TypeDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết loại sản phẩm" />

            <TypeForm viewMode="details" typeId={params.id} />
        </DefaultLayout>
    );
};

export default TypeDetails;

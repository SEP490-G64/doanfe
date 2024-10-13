import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TypeForm from "@/components/Type/TypeForm/page";

export const metadata: Metadata = {
    title: "Cập nhật loại sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TypeDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật loại sản phẩm" />

            <TypeForm viewMode="update" typeId={params.id} />
        </DefaultLayout>
    );
};

export default TypeDetails;

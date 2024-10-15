import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TypeForm from "@/components/Type/TypeForm/page";

export const metadata: Metadata = {
    title: "Thêm mới loại sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TypeDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới loại sản phẩm" />

            <TypeForm viewMode="create" />
        </DefaultLayout>
    );
};

export default TypeDetails;

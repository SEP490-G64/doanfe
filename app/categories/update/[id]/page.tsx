﻿import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật nhóm sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CategoryForm = dynamic(() => import("@/components/Category/CategoryForm/page"), {
    ssr: false,
});

const CategoryDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật nhóm sản phẩm" />

            <CategoryForm viewMode="update" categoryId={params.id} />
        </DefaultLayout>
    );
};

export default CategoryDetails;

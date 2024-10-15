import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import CategoryForm from "@/components/Category/CategoryForm/page";

export const metadata: Metadata = {
    title: "Thêm mới nhóm sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CategoryDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới nhóm sản phẩm" />

            <CategoryForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CategoryDetails;

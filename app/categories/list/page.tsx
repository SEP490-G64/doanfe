import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoriesTable from "@/components/Category/CategoryTable/page";

export const metadata: Metadata = {
    title: "Danh sách nhóm sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CategoryList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhóm sản phẩm" />

            <CategoriesTable />
        </DefaultLayout>
    );
};

export default CategoryList;

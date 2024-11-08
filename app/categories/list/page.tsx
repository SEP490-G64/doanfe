import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoryHeaderTaskbar from "@/components/HeaderTaskbar/CategoryHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách nhóm sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CategoriesTable = dynamic(() => import("@/components/Category/CategoryTable/page"), { ssr: false });

const CategoryList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhóm sản phẩm" />

            <CategoryHeaderTaskbar />

            <div className="flex flex-col gap-18">
                <CategoriesTable />
            </div>
        </DefaultLayout>
    );
};

export default CategoryList;

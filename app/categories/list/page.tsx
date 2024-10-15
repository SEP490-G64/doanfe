import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/CategoriesTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CategoryHeaderTaskbar from "@/components/HeaderTaskbar/CategoryHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách nhóm sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CategoryList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách nhóm sản phẩm" />

            <CategoryHeaderTaskbar />

            <div className="flex flex-col gap-18">
                <TableThree />
            </div>
        </DefaultLayout>
    );
};

export default CategoryList;

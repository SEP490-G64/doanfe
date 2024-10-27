import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TypesTable from "@/components/Type/TypeTable/page";

export const metadata: Metadata = {
    title: "Danh sách loại sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TypeList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách loại sản phẩm" />

            <TypesTable />
        </DefaultLayout>
    );
};

export default TypeList;

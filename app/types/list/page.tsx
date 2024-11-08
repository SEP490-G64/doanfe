import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TypeHeaderTaskbar from "@/components/HeaderTaskbar/TypeHeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách loại sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TypesTable = dynamic(() => import("@/components/Type/TypeTable/page"), {
    ssr: false,
});

const TypeList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách loại sản phẩm" />

            <TypeHeaderTaskbar />

            <div className="flex flex-col gap-18">
                <TypesTable />
            </div>
        </DefaultLayout>
    );
};

export default TypeList;

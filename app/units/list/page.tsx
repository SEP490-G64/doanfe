import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách đơn vị ",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UnitTable = dynamic(() => import("@/components/Unit/UnitTable/page"), {
    ssr: false,
});

const UnitList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách đơn vị" />

            <UnitTable />
        </DefaultLayout>
    );
};

export default UnitList;

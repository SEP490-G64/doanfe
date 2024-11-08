import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Thêm mới đơn vị",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UnitForm = dynamic(() => import("@/components/Unit/UnitForm/page"), {
    ssr: false,
});

const UnitDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới đơn vị" />

            <UnitForm viewMode="create" />
        </DefaultLayout>
    );
};

export default UnitDetails;

import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật đơn vị",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UnitForm = dynamic(() => import("@/components/Unit/UnitForm/page"), {
    ssr: false,
});

const UnitDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật đơn vị" />

            <UnitForm viewMode="update" UnitId={params.id} />
        </DefaultLayout>
    );
};

export default UnitDetails;

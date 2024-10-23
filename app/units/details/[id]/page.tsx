import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UnitForm from "@/components/Unit/UnitForm/page";

export const metadata: Metadata = {
    title: "Chi tiết đơn vị",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UnitDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết đơn vị" />

            <UnitForm viewMode="details" UnitId={params.id} />
        </DefaultLayout>
    );
};

export default UnitDetails;

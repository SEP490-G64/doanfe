import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UnitForm from "@/components/Unit/UnitForm/page";

export const metadata: Metadata = {
    title: "Thêm mới đơn vị",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UnitDetails = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới đơn vị" />

            <UnitForm viewMode="create" />
        </DefaultLayout>
    );
};

export default UnitDetails;

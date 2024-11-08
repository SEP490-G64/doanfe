import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import UnitHeaderTaskbar from "@/components/HeaderTaskbar/UnitHeaderTaskbar/page";

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

            <UnitHeaderTaskbar />

            <div className="flex flex-col gap-18">
                <UnitTable />
            </div>
        </DefaultLayout>
    );
};

export default UnitList;

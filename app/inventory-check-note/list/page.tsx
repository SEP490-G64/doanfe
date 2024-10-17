import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/page";
import InventoryCheckTable from "@/components/InventoryCheck/InventoryCheckTable";

export const metadata: Metadata = {
    title: "Danh sách phiếu kiểm kho",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InventoryCheckList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách phiếu kiểm kho" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <InventoryCheckTable />
            </div>
        </DefaultLayout>
    );
};

export default InventoryCheckList;

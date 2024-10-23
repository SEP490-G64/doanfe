import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Branch/BranchTable/page";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách phiếu nhập hàng",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const InboundList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách phiếu nhập hàng" />

            <HeaderTaskbar />

            <div className="flex flex-col gap-18">
                <TableThree />
            </div>
        </DefaultLayout>
    );
};

export default InboundList;

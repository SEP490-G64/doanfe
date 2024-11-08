import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BatchTable from "@/components/Batch/BatchTable";

export const metadata: Metadata = {
    title: "Danh sách lô sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const BatchDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách lô sản phẩm" />

            <BatchTable productId={params.id} />
        </DefaultLayout>
    );
};

export default BatchDetails;

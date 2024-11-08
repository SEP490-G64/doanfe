import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BatchForm from "@/components/Batch/BatchForm";

export const metadata: Metadata = {
    title: "Cập nhật lô sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateBatch = ({ params }: { params: { id: string, batchId: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật lô sản phẩm" />

            <BatchForm viewMode="update" productId={params.id} batchId={params.batchId} />
        </DefaultLayout>
    );
};

export default UpdateBatch;

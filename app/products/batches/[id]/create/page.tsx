import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import BatchForm from "@/components/Batch/BatchForm";

export const metadata: Metadata = {
    title: "Thêm mới lô sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateBatch = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới lô sản phẩm" />

            <BatchForm viewMode="create" productId={params.id} />
        </DefaultLayout>
    );
};

export default CreateBatch;

import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductForm from "@/components/Product/ProductForm";
import BatchForm from "@/components/Batch/BatchForm";

export const metadata: Metadata = {
    title: "Chi tiết lô sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductDetails = ({ params }: { params: { id: string, batchId: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết lô sản phẩm" />

            <BatchForm viewMode="details" productId={params.id} batchId={params.batchId} />
        </DefaultLayout>
    );
};

export default ProductDetails;

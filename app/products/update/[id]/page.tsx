import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Cập nhật sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductForm = dynamic(() => import("@/components/Product/ProductForm"), {
    ssr: false,
});

const UpdateProduct = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật sản phẩm" />

            <ProductForm viewMode="update" productId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateProduct;

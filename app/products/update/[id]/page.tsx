import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductForm from "@/components/Product/ProductForm";

export const metadata: Metadata = {
    title: "Cập nhật sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const UpdateProduct = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Cập nhật sản phẩm" />

            <ProductForm viewMode="update" productId={params.id} />
        </DefaultLayout>
    );
};

export default UpdateProduct;

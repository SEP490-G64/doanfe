import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductForm from "@/components/Product/ProductForm";

export const metadata: Metadata = {
    title: "Chi tiết sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductDetails = ({ params }: { params: { id: string } }) => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Chi tiết sản phẩm" />

            <ProductForm viewMode="details" productId={params.id} />
        </DefaultLayout>
    );
};

export default ProductDetails;

import { Metadata } from "next";
import dynamic from "next/dynamic";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

export const metadata: Metadata = {
    title: "Thêm mới sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductForm = dynamic(() => import("@/components/Product/ProductForm"), {
    ssr: false,
});

const CreateProduct = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới sản phẩm" />

            <ProductForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateProduct;

import { Metadata } from "next";

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductForm from "@/components/Product/ProductForm";

export const metadata: Metadata = {
    title: "Thêm mới sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const CreateProduct = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Thêm mới sản phẩm" />

            <ProductForm viewMode="create" />
        </DefaultLayout>
    );
};

export default CreateProduct;

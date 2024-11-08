import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductsTable = dynamic(() => import("@/components/Product/ProductsTable"), { ssr: false });

const ProductList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách sản phẩm" />

            <ProductsTable />
        </DefaultLayout>
    );
};

export default ProductList;

import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductsTable from "@/components/Product/ProductsTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Danh sách sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách sản phẩm" />

            <ProductsTable />
        </DefaultLayout>
    );
};

export default ProductList;

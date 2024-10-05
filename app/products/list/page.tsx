import { Metadata } from "next";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ProductsTable from "@/components/Tables/ProductsTable";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import HeaderTaskbar from "@/components/HeaderTaskbar/page";

export const metadata: Metadata = {
    title: "Danh sách sản phẩm",
    description: "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const ProductList = () => {
    return (
        <DefaultLayout>
            <Breadcrumb pageName="Danh sách sản phẩm" />

            <HeaderTaskbar buttons={"import"} />

            <div className="flex flex-col gap-18">
                <ProductsTable />
            </div>
        </DefaultLayout>
    );
};

export default ProductList;

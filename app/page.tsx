import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Home Page For Long Tam Pharmacy",
};

export default function Home() {
    return (
        <DefaultLayout>
            <ECommerce />
        </DefaultLayout>
    );
}

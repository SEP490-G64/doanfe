import { Metadata } from "next";
import dynamic from "next/dynamic";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Home Page For Long Tam Pharmacy",
};

const ECommerce = dynamic(() => import("@/components/Dashboard/E-commerce"), { ssr: false });

export function Home() {
    return (
        <DefaultLayout>
            <ECommerce />
        </DefaultLayout>
    );
}

export default Home;

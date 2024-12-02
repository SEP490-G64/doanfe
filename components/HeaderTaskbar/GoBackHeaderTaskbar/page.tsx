import React from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

import Button from "@/components/UI/Button";

function HeaderTaskbar() {
    const router = useRouter();

    return (
        <div className="mb-6 flex flex-col">
            <div className="flex justify-end">
                <Button label="Quay lại" size="small" icon={<IoIosArrowBack />} onClick={() => router.back()} />
            </div>
        </div>
    );
}

export default HeaderTaskbar;

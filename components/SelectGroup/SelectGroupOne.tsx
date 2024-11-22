"use client";
import React, { useState } from "react";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";

const SelectGroupOne = ({
    placeHolder,
    optsData,
    setDataSearch,
    dataSearch,
    dataKey,
}: {
    placeHolder: string;
    optsData: { value: string; label: string }[];
    setDataSearch: (data: any) => void;
    dataSearch: any;
    dataKey: string;
}) => {
    const [isOptionSelected, setIsOptionSelected] = useState<boolean>(!!dataSearch[dataKey]);
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setDataSearch({
            ...dataSearch,
            [dataKey]: value,
        });
        setIsOptionSelected(!!value);
    };

    return (
        <div className="w-full">
            <div className="relative z-20 w-full">
                <select
                    value={dataSearch[dataKey] || ""}
                    onChange={handleChange}
                    className={`size-full min-w-[40px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition ${isOptionSelected ? "text-black dark:text-white" : "text-gray-500"} focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                    style={{ minHeight: "40px" }} // đảm bảo kích thước tối thiểu phù hợp với nút
                    disabled={userInfo?.roles[0].type === "STAFF" && dataKey == "branchId"}
                >
                    <option value="" className="text-gray-500">
                        {placeHolder}
                    </option>

                    {optsData.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-black dark:text-white">
                            {opt.label}
                        </option>
                    ))}
                </select>

                <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2">
                    <svg
                        className="text-gray-500 fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"></path>
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default SelectGroupOne;

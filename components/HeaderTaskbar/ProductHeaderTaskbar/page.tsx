"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaFileImport, FaPlus } from "react-icons/fa6";

import Button from "@/components/UI/Button";
import { DataSearch } from "@/types/product";
import { getAllCategory } from "@/services/categoryServices";
import { getAllType } from "@/services/typeServices";
import { getAllManufacturer } from "@/services/manufacturerServices";
import { Category } from "@/types/category";
import { Type } from "@/types/type";
import { Manufacturer } from "@/types/manufacturer";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";

function HeaderTaskbar({
    sessionToken,
    buttons,
    dataSearch,
    setDataSearch,
    handleSearch,
}: {
    sessionToken: string;
    buttons?: string;
    dataSearch?: DataSearch;
    setDataSearch?: any;
    handleSearch?: any;
}) {
    const router = useRouter();
    const [cateOpts, setCateOpts] = useState([]);
    const [typeOpts, setTypeOpts] = useState([]);
    const [manOpts, setManOpts] = useState([]);
    const statusOpts = [
        { value: "CON_HANG", label: "Còn hàng" },
        { value: "HET_HANG", label: "Hết hàng" },
        { value: "NGUNG_KINH_DOANH", label: "Ngừng kinh doanh" },
    ];

    const getDataOptions = async () => {
        try {
            const response = await Promise.all([
                getAllCategory(sessionToken),
                getAllType(sessionToken),
                getAllManufacturer(sessionToken),
            ]);

            if (response) {
                setCateOpts(response[0].data.map((c: Category) => ({ value: c.id, label: c.categoryName })));
                setTypeOpts(response[1].data.map((t: Type) => ({ value: t.id, label: t.typeName })));
                setManOpts(response[2].data.map((m: Manufacturer) => ({ value: m.id, label: m.manufacturerName })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDataOptions();
    }, []);

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
                <div className="relative">
                    <button
                        className="absolute left-0 top-0 h-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700 flex items-center justify-center"
                        onClick={handleSearch}
                    >
                        <svg
                            className="fill-white hover:fill-yellow-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    <input
                        type="text"
                        value={dataSearch?.keyword}
                        placeholder="Nhập để tìm kiếm..."
                        onChange={(e) => setDataSearch({ ...dataSearch, keyword: e.target.value })}
                        className="w-full bg-white pl-12 pr-4 py-2 font-medium focus:outline-none xl:w-125"
                    />
                </div>

                {/* Khối này chỉ để 4 ô search*/}
                <div className="mt-2 flex gap-2">
                    <SelectGroupOne
                        placeHolder={"Chọn nhóm thuốc"}
                        optsData={cateOpts}
                        dataSearch={dataSearch}
                        setDataSearch={setDataSearch}
                        dataKey="categoryId"
                    />

                    <SelectGroupOne
                        placeHolder={"Chọn loại thuốc"}
                        optsData={typeOpts}
                        dataSearch={dataSearch}
                        setDataSearch={setDataSearch}
                        dataKey="typeId"
                    />

                    <SelectGroupOne
                        placeHolder={"Chọn nhà sản xuất"}
                        optsData={manOpts}
                        dataSearch={dataSearch}
                        setDataSearch={setDataSearch}
                        dataKey="manufacturerId"
                    />

                    <SelectGroupOne
                        placeHolder={"Chọn trạng thái"}
                        optsData={statusOpts}
                        dataSearch={dataSearch}
                        setDataSearch={setDataSearch}
                        dataKey="status"
                    />
                </div>
            </div>
            <div className="flex gap-2">
                {buttons === "import" && (
                    <Button label="Nhập file" size="small" icon={<FaFileImport />} type="success" onClick={() => {
                    }} />
                )}
                <Button
                    label="Thêm mới"
                    size="small"
                    icon={<FaPlus />}
                    onClick={() => router.push("/products/create")}
                />
            </div>
        </div>
    );
}

export default HeaderTaskbar;

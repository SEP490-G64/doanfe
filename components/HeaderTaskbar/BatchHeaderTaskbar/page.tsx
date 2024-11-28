import React from "react";
import { FaFileImport, FaPlus } from "react-icons/fa6";

import Button from "@/components/UI/Button";
import { DataSearch } from "@/types/product";
import { useRouter } from "next/navigation";
import DatePickerThree from "@/components/FormElements/DatePicker/DatePickerThree";
import InputDateOne from "@/components/FormElements/InputDate/InputDateOne";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";

function HeaderTaskbar({
                               productId,
                               sessionToken,
                               buttons,
                               dataSearch,
                               setDataSearch,
                               handleSearch,
                           }: {
    productId?: string;
    sessionToken: string;
    buttons?: string;
    dataSearch?: DataSearch;
    setDataSearch?: any;
    handleSearch?: any;
}) {
    const router = useRouter();

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

                <div className="mt-2 flex gap-4 items-center justify-between w-full">
                    {/* Nhóm Produce */}
                    {/*<div className="flex flex-col w-1/2">*/}
                    {/*    <span className="font-semibold text-gray-700">Ngày sản xuất:</span>*/}
                    {/*    <div className="flex gap-2 mt-1 items-center">*/}
                    {/*        <span className="text-gray-600">Từ:</span>*/}
                    {/*        <InputDateOne*/}
                    {/*            dataSearch={dataSearch}*/}
                    {/*            setDataSearch={setDataSearch}*/}
                    {/*            dataKey="produceStartDate"*/}
                    {/*        />*/}
                    {/*        <span className="text-gray-600">Đến:</span>*/}
                    {/*        <InputDateOne*/}
                    {/*            dataSearch={dataSearch}*/}
                    {/*            setDataSearch={setDataSearch}*/}
                    {/*            dataKey="produceEndDate"*/}
                    {/*        />*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* Nhóm Expire */}
                    <div className="flex flex-col w-full">
                        {/*<span className="font-semibold text-gray-700">Ngày hết hạn:</span>*/}
                        <div className="flex gap-2 mt-1 items-center">
                            <span className="text-gray-600">Từ:</span>
                            <InputDateOne
                                dataSearch={dataSearch}
                                setDataSearch={setDataSearch}
                                dataKey="expireStartDate"
                            />
                            <span className="text-gray-600">Đến:</span>
                            <InputDateOne
                                dataSearch={dataSearch}
                                setDataSearch={setDataSearch}
                                dataKey="expireEndDate"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="flex gap-2">*/}
            {/*    <Button*/}
            {/*        label="Thêm mới"*/}
            {/*        size="small"*/}
            {/*        icon={<FaPlus />}*/}
            {/*        onClick={() => router.push(`/products/batches/${productId}/create`)}*/}
            {/*    />*/}
            {/*</div>*/}
        </div>
    );
}

export default HeaderTaskbar;

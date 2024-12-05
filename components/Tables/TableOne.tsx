import React from "react";
import { CiExport, CiImport } from "react-icons/ci";
import { bold } from "next/dist/lib/picocolors";
import { formatLargeNumber } from "@/utils/methods";

interface Product {
    id: string;
    productName: string;
    image: string;
    inboundQuantity: number;
    outboundQuantity: number;
    totalQuantity: number;
    inboundPrice: number;
    outboundPrice: number;
    totalPrice: number;
    unitName: string;
}

interface TableOneProps {
    data: Product[] | undefined; // Ensure data can be undefined
}

const TableOne: React.FC<TableOneProps> = ({ data }) => {
    // Check if data is defined and is an array
    if (!data || !Array.isArray(data)) {
        return <div className="text-center p-4">Không có sản phẩm nào tồn tại</div>;
    }

    return (
        <div
            className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Top Sản phẩm có giá trị nhập - xuất cao nhất trong 30 ngày qua
            </h4>

            <div className="flex flex-col">
                {/* Header Row */}
                <div className="grid grid-cols-12 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="col-span-3 p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Sản phẩm</h5>
                    </div>
                    <div className="col-span-3 p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Số lượng</h5>
                    </div>
                    <div className="col-span-2 p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Tổng</h5>
                    </div>
                    <div className="col-span-3 hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Giá trị</h5>
                    </div>
                    <div className="col-span-1 hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Tổng</h5>
                    </div>
                </div>

                {/* Data Rows */}
                {data.length > 0 ? (
                    data.map((product, key) => (
                        <div
                            className={`grid grid-cols-12 ${
                                key === data.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                            }`}
                            key={product.id}
                        >
                            {/* Product Column */}
                            <div className="col-span-3 flex items-center gap-3 p-2.5 xl:p-5">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.productName}
                                        width={48}
                                        height={48}
                                        className="rounded object-cover"
                                    />
                                ) : (
                                    <img
                                        src={"/images/no-image.png"}
                                        alt={product.productName}
                                        width={48}
                                        height={48}
                                        className="rounded object-cover"
                                    />
                                )}
                                <p className="hidden text-black sm:block dark:text-white">{product.productName}</p>
                            </div>

                            {/* Quantity Column */}
                            <div className="col-span-3 flex items-center justify-center flex-wrap p-5 xl:p-5">
                                <div className="w-full flex items-center justify-center">
                                    <p className="flex items-center text-black dark:text-white">
                                        {formatLargeNumber(product.inboundQuantity)} {product.unitName}{" "}
                                        <CiImport className="ml-2 text-success"/>
                                    </p>
                                </div>
                                <div className="w-full flex items-center justify-center">
                                    <p className="flex items-center text-black dark:text-white">
                                        {formatLargeNumber(product.outboundQuantity)} {product.unitName}{" "}
                                        <CiExport className="ml-2 text-danger"/>
                                    </p>
                                </div>
                            </div>

                            {/* Total Quantity Column */}
                            <div className="col-span-2 flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-meta-5">
                                    {formatLargeNumber(product.totalQuantity)} {product.unitName}
                                </p>
                            </div>

                            {/* Price Column */}
                            <div className="col-span-3 flex items-center justify-center flex-wrap p-5 xl:p-5">
                                <div className="w-full flex items-center justify-center">
                                    <p className="flex items-center text-black dark:text-white">
                                        {formatLargeNumber(product.inboundPrice)}đ{" "}
                                        <CiImport className="ml-2 text-success"/>
                                    </p>
                                </div>
                                <div className="w-full flex items-center justify-center">
                                    <p className="flex items-center text-black dark:text-white">
                                        {formatLargeNumber(product.outboundPrice)}đ{" "}
                                        <CiExport className="ml-2 text-danger"/>
                                    </p>
                                </div>
                            </div>

                            {/* Total Price Column */}
                            <div className="col-span-1 flex items-center justify-center p-2.5 xl:p-5">
                                <p className="text-meta-3">
                                    {formatLargeNumber(product.totalPrice)}đ
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-4 text-center">Không có sản phẩm nào</div>
                )}
            </div>
        </div>
    );
};

export default TableOne;

"use client";
import React, { useCallback, useEffect, useMemo, useState, Fragment } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Pagination,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow, Tooltip, useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { toast } from "react-toastify";

import { useAppContext } from "@/components/AppProvider/AppProvider";
import HeaderTaskbar from "@/components/HeaderTaskbar/InventoryReportHeaderTaskbar/page";
import Loader from "@/components/common/Loader";
import { InventoryBatchReportColumns, InventoryReportColumns } from "@/utils/data";
import { DataSearch, InventoryBatchReport } from "@/types/report";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";
import { InventoryReport } from "@/types/report";
import { getStockReport } from "@/services/reportServices";
import { formatDateTimeDDMMYYYY } from "@/utils/methods";

const InventoryReportTable = () => {
    const [loading, setLoading] = useState(false);
    const [InventoryReportData, setInventoryReportData] = useState<InventoryReport[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const { sessionToken } = useAppContext();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedProduct, setSelectedProduct] = useState<InventoryReport | null>(null);

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded?.information;
    const [dataSearch, setDataSearch] = useState<DataSearch>({
        keyword: "",
        branchId: userInfo?.branch.id,
    });

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const getListStockByPage = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getStockReport(
                (page - 1).toString(),
                rowsPerPage.toString(),
                dataSearch,
                sessionToken
            );

            if (response.message === "200 OK") {
                setInventoryReportData(
                    response.data.map((item: InventoryReport, index: number) => ({
                        ...item,
                        index: index + 1 + (page - 1) * rowsPerPage,
                    }))
                );
                setTotal(response.total);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        await getListStockByPage();
    };

    useEffect(() => {
        getListStockByPage();
    }, [page, rowsPerPage]);

    const renderCell = useCallback((report: InventoryReport, columnKey: React.Key) => {
        const cellValue = report[columnKey as "productName"];

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{report.index}</h5>;
            case "image":
                return report.image ? (
                    <img src={report.image} loading={"lazy"} alt="product-image" width={64} height={64} />
                ) : (
                    <Image src={"/images/no-image.png"} loading={"lazy"} alt="product-image" width={64} height={64} />
                );
            case "registrationCode":
                return <h5 className="font-normal text-black dark:text-white">{report.registrationCode}</h5>;
            case "productName":
                return <h5 className="font-normal text-black dark:text-white">{report.productName}</h5>;
            case "minQuantity":
                return <h5 className="font-normal text-black dark:text-white">{report.minQuantity?.toLocaleString()} {report.unit}</h5>;
            case "maxQuantity":
                return <h5 className="font-normal text-black dark:text-white">{report.maxQuantity?.toLocaleString()}  {report.unit}</h5>;
            case "totalQuantity":
                // Kiểm tra điều kiện so với min và max để thay đổi màu sắc
                let totalQuantityClass = "text-green-700"; // Màu mặc định
                let iconClass = ""; // Biểu tượng cảnh báo

                if (report.totalQuantity < report.minQuantity) {
                    totalQuantityClass = "text-meta-1"; // Cảnh báo khi totalQuantity < minQuantity
                    iconClass = "bg-meta-1"; // Thêm biểu tượng cảnh báo đỏ
                } else if (report.totalQuantity > report.maxQuantity) {
                    totalQuantityClass = "text-yellow-500"; // Cảnh báo khi totalQuantity > maxQuantity
                    iconClass = "bg-yellow-500"; // Thêm biểu tượng cảnh báo vàng
                }

                return (
                    <div className="flex items-center justify-center space-x-2">
                        {iconClass && (
                            <div
                                className={`w-3 h-3 rounded-full ${iconClass}`}
                            ></div>
                        )}
                        <h5 className={`font-normal ${totalQuantityClass} dark:text-white`}>
                            {report.totalQuantity?.toLocaleString()} {report.unit}
                        </h5>
                    </div>
                );
            case "sellableQuantity":
                // Kiểm tra điều kiện so với min và max để thay đổi màu sắc
                let sellableQuantityClass = "text-green-700"; // Màu mặc định
                let iconSellableClass = ""; // Biểu tượng cảnh báo

                if (report.sellableQuantity <= 0) {
                    sellableQuantityClass = "text-meta-1"; // Cảnh báo khi totalQuantity < minQuantity
                    iconSellableClass = "bg-meta-1"; // Thêm biểu tượng cảnh báo đỏ
                }

                return (
                    <div className="flex items-center justify-center space-x-2">
                        {iconSellableClass && (
                            <div
                                className={`w-3 h-3 rounded-full ${iconSellableClass}`}
                            ></div>
                        )}
                        <h5 className={`font-normal ${sellableQuantityClass} dark:text-white`}>
                            {report.sellableQuantity?.toLocaleString()} {report.unit}
                        </h5>
                    </div>
                );
            case "storageLocation":
                return <h5 className="font-normal text-black dark:text-white">{report.storageLocation}</h5>;
            case "actions":
                return (
                    <Tooltip content="Xem thông tin lô">
                        <button
                            className="hover:text-primary"
                            onClick={() => {
                                setSelectedProduct(report);
                                onOpen();
                                console.log(selectedProduct)
                            }}
                        >
                            <svg
                                className="fill-current"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                    fill=""
                                />
                                <path
                                    d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                    fill=""
                                />
                            </svg>
                        </button>
                    </Tooltip>
                );
            default:
                return cellValue;
        }
    }, []);

    const renderBatchCell = useCallback(
        (report: InventoryBatchReport, columnKey: React.Key) => {
            // Tính toán index của lô sản phẩm trong selectedProduct.batches
            const index = selectedProduct?.batches?.findIndex((batch) => batch.batchId === report.batchId);

            const cellValue = report[columnKey as "batchCode"];

            switch (columnKey) {
                case "index":
                    return (
                        <h5 className="font-normal text-black dark:text-white">
                            {index !== undefined ? index + 1 : "-"}
                        </h5>
                    ); // Hiển thị index chính xác
                case "batchCode":
                    return <h5 className="font-normal text-black dark:text-white">{report.batchCode}</h5>;
                case "expireDate":
                    return (
                        <h5 className="font-normal text-black dark:text-white">
                            {formatDateTimeDDMMYYYY(report.expireDate)}
                        </h5>
                    );
                case "totalQuantity":
                    let quantityClass = "text-green-700"; // Màu mặc định
                    let iconClass = ""; // Biểu tượng cảnh báo

                    if (new Date(report.expireDate!) < new Date()) {
                        quantityClass = "text-meta-1"; // Cảnh báo khi totalQuantity < minQuantity
                        iconClass = "bg-meta-1"; // Thêm biểu tượng cảnh báo đỏ
                    }

                    return (
                        <div className="flex items-center justify-center space-x-2">
                            {quantityClass && (
                                <div
                                    className={`w-3 h-3 rounded-full ${iconClass}`}
                                ></div>
                            )}
                            <h5 className={`font-normal ${quantityClass} dark:text-white`}>
                                {report.totalQuantity?.toLocaleString()} {selectedProduct?.unit}
                            </h5>
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [selectedProduct]
    ); // Đảm bảo rằng selectedProduct được sử dụng trong useCallback

    if (loading) return <Loader />;
    else {
        if (!userInfo?.roles?.some((role) => role.type === "MANAGER" || role.type === "STAFF")) {
            return <Unauthorized></Unauthorized>;
        }
        return (
            <>
                <HeaderTaskbar
                    sessionToken={sessionToken}
                    dataSearch={dataSearch}
                    setDataSearch={setDataSearch}
                    handleSearch={handleSearch}
                />
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                    Tìm thấy <span className="font-bold text-blue-600">{total}</span> sản phẩm
                    {/* Thêm phần ghi chú về màu sắc */}
                    <div className="text-gray-600 flex justify-start text-sm">
                        <div className="space-y-2">
                            <p className="ml-4">
                                <strong>Lưu ý:</strong>
                            </p>
                            <ul className="ml-10">
                                <li className="flex items-center">
                                    {/* Ô vuông màu đỏ */}
                                    <div className="mr-2 h-4 w-4 rounded-sm bg-[#e53e3e]"></div>
                                    <span className="text-gray-700">
                                        Số lượng tồn kho nhỏ hơn định mức dưới (dưới định mức) | Số lượng có thể bán nhỏ hơn 0
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    {/* Ô vuông màu vàng */}
                                    <div className="mr-2 h-4 w-4 rounded-sm bg-[#d69e2e]"></div>
                                    <span className="text-gray-700">
                                        Số lượng tồn kho lớn hơn định mức trên (vượt định mức)
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    {/* Ô vuông màu xanh lá */}
                                    <div className="mr-2 h-4 w-4 rounded-sm bg-[#38a169]"></div>
                                    <span className="text-gray-700">Số lượng tồn kho trong phạm vi bình thường | Số lượng có thể bán lớn hơn 0</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="max-w-full overflow-x-auto">
                        <Table
                            bottomContent={
                                totalPages > 0 ? (
                                    <div className="flex w-full justify-between">
                                        <Select
                                            label="Số bản ghi / trang"
                                            selectedKeys={[rowsPerPage.toString()]}
                                            onChange={(e) => {
                                                setRowsPerPage(parseInt(e.target.value));
                                                setPage(1);
                                            }}
                                            size="sm"
                                            className="max-w-xs"
                                        >
                                            <SelectItem key={10} value={10}>
                                                10
                                            </SelectItem>
                                            <SelectItem key={25} value={25}>
                                                25
                                            </SelectItem>
                                            <SelectItem key={50} value={50}>
                                                50
                                            </SelectItem>
                                            <SelectItem key={70} value={70}>
                                                70
                                            </SelectItem>
                                        </Select>
                                        <Pagination
                                            isCompact
                                            showControls
                                            showShadow
                                            color="primary"
                                            page={page}
                                            total={totalPages}
                                            onChange={(page) => setPage(page)}
                                        />
                                    </div>
                                ) : null
                            }
                            aria-label="Branch Table"
                        >
                            <TableHeader columns={InventoryReportColumns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.uid}
                                        className="whitespace-normal break-words py-4 text-sm font-medium text-black"
                                        align="center"
                                    >
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={InventoryReportData ?? []} emptyContent={"Không có dữ liệu"}>
                                {(item) => (
                                    <TableRow key={item.productId}>
                                        {(columnKey) => (
                                            <TableCell
                                                className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${["productName", "registrationCode"].includes(columnKey as string) ? "text-left" : ""}`}
                                            >
                                                {renderCell(item, columnKey)}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "min-w-[820px]" }}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Danh sách lô sản phẩm - {selectedProduct?.productName || "Không có dữ liệu"}
                                    <div className="text-gray-600 flex justify-start text-sm">
                                        <div className="space-y-2">
                                            <p className="ml-4">
                                                <strong>Lưu ý:</strong>
                                            </p>
                                            <ul className="ml-10">
                                                <li className="flex items-center">
                                                    {/* Ô vuông màu đỏ */}
                                                    <div className="mr-2 h-4 w-4 rounded-sm bg-[#e53e3e]"></div>
                                                    <span className="text-gray-700">
                                                        Lô sản phẩm hết hạn
                                                    </span>
                                                </li>
                                                <li className="flex items-center">
                                                    {/* Ô vuông màu xanh lá */}
                                                    <div className="mr-2 h-4 w-4 rounded-sm bg-[#38a169]"></div>
                                                    <span className="text-gray-700">
                                                        Lô sản phẩm bình thường
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </ModalHeader>
                                <ModalBody>
                                    {selectedProduct ? (
                                        <Table
                                            aria-label="List Products Changed Quantity"
                                            isHeaderSticky
                                            classNames={{
                                                wrapper: "max-h-[400px] overflow-y-scroll",
                                            }}
                                        >
                                            <TableHeader columns={InventoryBatchReportColumns}>
                                                {(column) => (
                                                    <TableColumn
                                                        key={column.uid}
                                                        className="whitespace-normal break-words py-4 text-sm font-medium text-black"
                                                        align="center"
                                                    >
                                                        {column.name}
                                                    </TableColumn>
                                                )}
                                            </TableHeader>
                                            <TableBody
                                                items={selectedProduct.batches || []}
                                                emptyContent={"Không có dữ liệu"}
                                            >
                                                {(item) => (
                                                    <TableRow key={item.batchId}>
                                                        {(columnKey) => (
                                                            <TableCell
                                                                className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${["productName", "registrationCode"].includes(columnKey as string) ? "text-left" : ""}`}
                                                            >
                                                                {renderBatchCell(item, columnKey)}{" "}
                                                                {/* Pass index here */}
                                                            </TableCell>
                                                        )}
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <p>Không có thông tin lô sản phẩm.</p>
                                    )}
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            onClose();
                                        }}
                                    >
                                        Đóng
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </>
        );
    }
};

export default InventoryReportTable;

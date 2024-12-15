"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Select,
    SelectItem,
} from "@nextui-org/react";
import { useRouter, useSearchParams } from "next/navigation";

import Loader from "@/components/common/Loader";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { inventoryCheckColumnsTwo } from "@/utils/data";
import HeaderTaskbar from "@/components/HeaderTaskbar/InventoryCheckHeaderTaskbarTwo/page";
import Unauthorized from "@/components/common/Unauthorized";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import { Product } from "@/types/product";
import { formatDateTimeDDMMYYYY } from "@/utils/methods";
import {
    getListProductByCheckExpiredDate,
    getListProductByCheckNonePrice,
    getListProductByCheckNumberOfExpiredDate,
    getListProductByCheckPrice,
    getListProductByCheckQuantity,
} from "@/services/productServices";

const InventoryCheckTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [inventoryCheckData, setInventoryCheckData] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [filterMode, setFilterMode] = useState<"quantity" | "price" | "expireDate">(
        (searchParams.get("filterMode") as "quantity" | "price" | "expireDate") || "quantity"
    );
    const [selectedOptions, setSelectedOptions] = useState({
        lowQuantity: searchParams.get("lowQuantity") === "true" ? true : false,
        warningQuantity: searchParams.get("warningQuantity") === "false" ? false : true,
        outOfStock: searchParams.get("outOfStock") === "true" ? true : false,
        lostPrice: searchParams.get("lostPrice") === "true" ? true : false,
        warningPrice: searchParams.get("warningPrice") === "true" ? true : false,
        outExpireDate: searchParams.get("outExpireDate") === "true" ? true : false,
        lowExpireDate: searchParams.get("lowExpireDate") === "true" ? true : false,
    });
    const [lowQuantityNumber, setLowQuantityNumber] = useState(Number(searchParams.get("lowQuantityNumber")) || 0);
    const [numberOfDates, setNumberOfDates] = useState(Number(searchParams.get("numberOfDates")) || 0);

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const renderCell = useCallback((product: Product, columnKey: React.Key) => {
        const cellValue = product[columnKey as "id" | "productName" | "status"];

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{product.index}</h5>;
            case "productName":
                return <h5 className="font-normal text-black dark:text-white">{product.productName}</h5>;
            case "inboundPrice":
                return (
                    <h5 className={`font-normal text-black dark:text-white ${!product.inboundPrice && "text-danger"}`}>
                        {product.inboundPrice ? `${product.inboundPrice.toLocaleString()} VND` : "Chưa có thông tin"}
                    </h5>
                );
            case "sellPrice":
                return (
                    <h5 className={`font-normal text-black dark:text-white ${!product.sellPrice && "text-danger"}`}>
                        {product.sellPrice ? `${product.sellPrice.toLocaleString()} VND` : "Chưa có thông tin"}
                    </h5>
                );
            case "expireDate":
                return (
                    <h5 className="font-normal text-black dark:text-white">
                        {formatDateTimeDDMMYYYY(product.expireDate)}
                    </h5>
                );
            default:
                return cellValue;
        }
    }, []);

    useEffect(() => {
        const getListWarningProducts = async () => {
            if (loading) return;
            setLoading(true);
            try {
                let response;
                if (filterMode === "quantity") {
                    response = await getListProductByCheckQuantity(
                        (page - 1).toString(),
                        rowsPerPage.toString(),
                        selectedOptions.lowQuantity,
                        lowQuantityNumber,
                        selectedOptions.warningQuantity,
                        selectedOptions.outOfStock,
                        sessionToken
                    );

                    if (response.message === "200 OK") {
                        setInventoryCheckData(
                            response.data.map((item: Product, index: number) => ({
                                ...item,
                                index: index + 1 + (page - 1) * rowsPerPage,
                            }))
                        );
                        setTotal(response.total);
                    }
                } else if (filterMode === "price") {
                    if (selectedOptions.warningPrice) {
                        response = await getListProductByCheckPrice(
                            (page - 1).toString(),
                            rowsPerPage.toString(),
                            sessionToken
                        );
                        if (response.message === "200 OK") {
                            setInventoryCheckData(
                                response.data.map((item: Product, index: number) => ({
                                    ...item,
                                    index: index + 1 + (page - 1) * rowsPerPage,
                                }))
                            );
                            setTotal(response.total);
                        }
                    } else if (selectedOptions.lostPrice) {
                        response = await getListProductByCheckNonePrice(
                            (page - 1).toString(),
                            rowsPerPage.toString(),
                            sessionToken
                        );
                        if (response.message === "200 OK") {
                            setInventoryCheckData(
                                response.data.map((item: Product, index: number) => ({
                                    ...item,
                                    index: index + 1 + (page - 1) * rowsPerPage,
                                }))
                            );
                            setTotal(response.total);
                        }
                    }
                } else if (filterMode === "expireDate") {
                    if (selectedOptions.lowExpireDate) {
                        response = await getListProductByCheckNumberOfExpiredDate(
                            (page - 1).toString(),
                            rowsPerPage.toString(),
                            numberOfDates,
                            sessionToken
                        );
                        if (response.message === "200 OK") {
                            setInventoryCheckData(
                                response.data.map((item: any, index: number) => ({
                                    ...item,
                                    index: index + 1 + (page - 1) * rowsPerPage,
                                }))
                            );
                            setTotal(response.total);
                        }
                    } else if (selectedOptions.outExpireDate) {
                        response = await getListProductByCheckExpiredDate(
                            (page - 1).toString(),
                            rowsPerPage.toString(),
                            sessionToken
                        );
                        if (response.message === "200 OK") {
                            setInventoryCheckData(
                                response.data.map((item: any, index: number) => ({
                                    ...item,
                                    index: index + 1 + (page - 1) * rowsPerPage,
                                }))
                            );
                            setTotal(response.total);
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getListWarningProducts();
    }, []);

    useEffect(() => {
        //Tạo query string từ object dataSearch
        const queryParams = new URLSearchParams({
            ...selectedOptions,
            filterMode,
            lowQuantityNumber: lowQuantityNumber.toString(),
            numberOfDates: numberOfDates.toString(),
            page: page.toString(),
            size: rowsPerPage.toString(),
        }).toString();
        // Chuyển hướng đến đường dẫn mới với query string
        router.push(`/inventory-check?${queryParams}`);
    }, [selectedOptions, filterMode, numberOfDates, lowQuantityNumber, page, rowsPerPage, router]);

    if (loading) return <Loader />;
    else {
        if (!userInfo?.roles?.some((role) => role.type === "MANAGER" || role.type === "STAFF")) {
            return <Unauthorized></Unauthorized>;
        } else {
            return (
                <>
                    <HeaderTaskbar
                        setInventoryCheckData={setInventoryCheckData}
                        loading={loading}
                        setLoading={setLoading}
                        page={page}
                        pageSize={rowsPerPage}
                        setTotal={setTotal}
                        filterMode={filterMode}
                        setFilterMode={setFilterMode}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                        lowQuantity={lowQuantityNumber}
                        setLowQuantity={setLowQuantityNumber}
                        numberOfDates={numberOfDates}
                        setNumberOfDates={setNumberOfDates}
                        sessionToken={sessionToken}
                    />
                    <div className="rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark">
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
                                                <SelectItem key={5} value={5}>
                                                    5
                                                </SelectItem>
                                                <SelectItem key={10} value={10}>
                                                    10
                                                </SelectItem>
                                                <SelectItem key={15} value={15}>
                                                    15
                                                </SelectItem>
                                                <SelectItem key={20} value={20}>
                                                    20
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
                                <TableHeader>
                                    <TableHeader columns={inventoryCheckColumnsTwo}>
                                        {(column) => (
                                            <TableColumn
                                                key={column.uid}
                                                className="py-4 text-sm font-medium text-black"
                                                align="center"
                                            >
                                                {column.name}
                                            </TableColumn>
                                        )}
                                    </TableHeader>
                                </TableHeader>
                                <TableBody items={inventoryCheckData ?? []} emptyContent={"Không có dữ liệu"}>
                                    {(item) => (
                                        <TableRow
                                            key={item?.id}
                                            onClick={() => router.push(`/products/details/${item.id}`)}
                                            className="hover:cursor-pointer"
                                        >
                                            {(columnKey) => (
                                                <TableCell
                                                    className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${["inventoryCheckCode", "createdBy"].includes(columnKey as string) ? "text-left" : ""}`}
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
                </>
            );
        }
    }
};

export default InventoryCheckTable;

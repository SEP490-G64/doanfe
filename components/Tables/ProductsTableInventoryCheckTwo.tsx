"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Tooltip,
} from "@nextui-org/react";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import { formatDateTimeDDMMYYYYHHMM } from "@/utils/methods";
import { ProductCheckType } from "@/lib/schemaValidate/inventoryCheckSchema";
import { getProductsChangedHistory } from "@/services/productServices";
import { ProductChangedHistory } from "@/types/inventoryCheck";

const ProductsTableInventoryCheck = ({
    data,
    active,
    startedDate,
    sessionToken,
    setProducts,
}: {
    data: ProductCheckType[];
    active: boolean;
    startedDate: string;
    sessionToken: string;
    setProducts: any;
}) => {
    const [productsChanged, setProductsChanged] = useState<ProductChangedHistory[]>([]);
    const [changedQuantity, setChangedQuantity] = useState<number>(0);
    const [indexProduct, setIndexProduct] = useState<number>(-1);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 20;

    const pages = Math.ceil(data.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data.slice(start, end);
    }, [page, data]);

    const getProductsChanged = async (productId: number, batchCode: string | undefined) => {
        try {
            const response = await getProductsChangedHistory(startedDate, productId, sessionToken);

            if (response.status === "SUCCESS") {
                let products = response.data;
                if (batchCode)
                    products = products.filter((product: ProductChangedHistory) => product.batch === batchCode);
                else products = products.filter((product: ProductChangedHistory) => !product.batch);
                if (batchCode) {
                    setChangedQuantity(countQuantityChanged(true, batchCode, products));
                } else {
                    setChangedQuantity(countQuantityChanged(false, productId, products));
                }
                setProductsChanged(products);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const countQuantityChanged = (
        havaBatch: boolean,
        code: string | number,
        productsChanged: ProductChangedHistory[]
    ) => {
        let quantity = 0;
        productsChanged.forEach((product) => {
            if (havaBatch) {
                if (product?.batch === code) {
                    quantity += product.transactionType === "INBOUND" ? product.quantity : -product.quantity;
                }
            } else {
                if (product.productId === code && !product.batch) {
                    quantity += product.transactionType === "INBOUND" ? product.quantity : -product.quantity;
                }
            }
        });
        return quantity;
    };

    const renderCell = React.useCallback(
        (product: any, columnKey: any, index: number) => {
            const cellValue = product[columnKey];

            switch (columnKey) {
                case "no.":
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-bold text-sm capitalize text-default-400">{index + 1}</p>
                        </div>
                    );
                case "productName":
                    return (
                        <div className="flex items-center justify-start">
                            <p className="text-bold text-left text-sm capitalize text-secondary">
                                {product?.product?.productName}
                            </p>
                        </div>
                    );
                case "batchCode":
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-bold text-sm capitalize text-default-400">{product?.batch?.batchCode}</p>
                        </div>
                    );
                case "baseUnit":
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-bold text-sm capitalize text-default-400">
                                {product?.product?.baseUnit?.unitName}
                            </p>
                        </div>
                    );
                case "systemQuantity":
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-bold text-sm capitalize text-default-400">{product?.systemQuantity}</p>
                        </div>
                    );
                case "countedQuantity":
                    return (
                        <div className="flex items-center justify-center">
                            <input
                                type="number"
                                value={product?.countedQuantity || ""}
                                disabled={!active}
                                onChange={(e) => handleChangeCountedQuantity(e, index)}
                                className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                            />
                        </div>
                    );
                case "difference":
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <p className="text-bold text-sm capitalize text-default-400">{product?.difference}</p>
                        </div>
                    );
                case "reason":
                    return (
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center">
                                <input
                                    type="text"
                                    value={product?.reason || ""}
                                    disabled={!active}
                                    onChange={(e) => handleChangeReason(e, index)}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                            </div>
                        </div>
                    );
                case "actions":
                    return (
                        <div className="flex items-center justify-center space-x-3.5">
                            <Tooltip content="Chi tiết">
                                <button
                                    className="hover:text-primary"
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        setIndexProduct(index);
                                        await getProductsChanged(product?.product?.id, product?.batch?.batchCode);
                                        onOpen();
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
                        </div>
                    );
                default:
                    return cellValue;
            }
        },
        [data]
    );

    const renderCellTwo = React.useCallback((product: any, columnKey: any, index: number) => {
        const cellValue = product[columnKey];

        switch (columnKey) {
            case "quantity":
                return (
                    <div className="flex items-center justify-center">
                        <p
                            className={`text-bold text-sm capitalize ${product.transactionType === "INBOUND" ? "text-success" : "text-danger"}`}
                        >
                            {`${product.transactionType === "INBOUND" ? "+" : "-"} ${product?.quantity}`}
                        </p>
                    </div>
                );
            case "createdAt":
                return (
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-bold text-sm capitalize text-default-400">
                            {formatDateTimeDDMMYYYYHHMM(product?.createdAt)}
                        </p>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const handleChangeCountedQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].countedQuantity = Number(e.target.value.replace(/,/g, ""));
        if (data![index].systemQuantity) data![index].difference = data![index].systemQuantity - Number(e.target.value.replace(/,/g, ""));
        if (!e.target.value) data![index].difference = undefined;
        setProducts("inventoryCheckProductDetails", data);
    };

    const handleChangeReason = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].reason = e.target.value;
        setProducts("inventoryCheckProductDetails", data);
    };

    return (
        // <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
        <div>
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={page}
                            total={pages}
                            onChange={(page) => setPage(page)}
                        />
                    </div>
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn className="text-center" key="no.">
                        STT
                    </TableColumn>
                    <TableColumn className="text-center" key="productName">
                        Tên sản phẩm
                    </TableColumn>
                    <TableColumn className="text-center" key="batchCode">
                        Mã lô
                    </TableColumn>
                    <TableColumn className="text-center" key="baseUnit">
                        Đơn vị
                    </TableColumn>
                    <TableColumn className="text-center" key="systemQuantity">
                        Tồn trên hệ thống
                    </TableColumn>
                    <TableColumn className="text-center" key="countedQuantity">
                        Tồn thực tế
                    </TableColumn>
                    <TableColumn className="text-center" key="difference">
                        Chênh lệch
                    </TableColumn>
                    <TableColumn className="text-center" key="reason">
                        Lý do
                    </TableColumn>
                    <TableColumn className="text-center" key="actions">
                        Thao tác
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {items.map((item, index) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey, index + (page - 1) * rowsPerPage)}</TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "min-w-[820px]" }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Danh sách sản phẩm có sự thay đổi</ModalHeader>
                            <ModalBody>
                                <Table
                                    aria-label="List Products Changed Quantity"
                                    isHeaderSticky
                                    classNames={{
                                        wrapper: "max-h-[400px] overflow-y-scroll",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn className="text-center" key="productName">
                                            Tên sản phẩm
                                        </TableColumn>
                                        <TableColumn className="text-center" key="batch">
                                            Mã lô
                                        </TableColumn>
                                        <TableColumn className="text-center" key="quantity">
                                            Số lượng thay đổi
                                        </TableColumn>
                                        <TableColumn className="text-center" key="createdAt">
                                            Thời gian
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="Không có hoạt động nhập xuất nào diễn ra">
                                        {productsChanged.map((item, index) => (
                                            <TableRow key={index}>
                                                {(columnKey) => (
                                                    <TableCell>{renderCellTwo(item, columnKey, index)}</TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <div className="flex items-center justify-between gap-5">
                                    <p>
                                        Số lượng sản phẩm đã thay đổi là:{" "}
                                        <span className={changedQuantity > 0 ? "text-success" : "text-danger"}>
                                            {changedQuantity}
                                        </span>
                                    </p>
                                    <label>
                                        Nhập số lượng thực tế{" "}
                                        <input
                                            value={data[indexProduct]?.countedQuantity || ""}
                                            type="number"
                                            onChange={(e) => handleChangeCountedQuantity(e, indexProduct)}
                                            className="w-30 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </label>
                                </div>
                                <Button
                                    color="primary"
                                    onPress={() => {
                                        if (changedQuantity && data![indexProduct].countedQuantity) {
                                            data![indexProduct].countedQuantity -= changedQuantity;
                                            if (data![indexProduct].systemQuantity) {
                                                data![indexProduct].difference =
                                                    data![indexProduct].systemQuantity - data![indexProduct].countedQuantity;
                                            }
                                            setProducts("inventoryCheckProductDetails", data);
                                        }
                                        onClose();
                                    }}
                                >
                                    Chấp nhận
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ProductsTableInventoryCheck;

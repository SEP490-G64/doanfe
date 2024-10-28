"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/components/AppProvider/AppProvider";
import ProductHeaderTaskbar from "@/components/HeaderTaskbar/ProductHeaderTaskbar/allow-page";
import Loader from "@/components/common/Loader";
import { allowProductColumns } from "@/utils/data";
import { AllowProduct, DataSearch, Product } from "@/types/product";
import { getListAllowProduct } from "@/services/productServices";

const ProductsTable = () => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [dataSearch, setDataSearch] = useState<DataSearch>({
        keyword: ""
    });
    const { sessionToken } = useAppContext();

    const getListAllowProducts = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getListAllowProduct(
                dataSearch,
                sessionToken
            );

            if (response.message === "200 OK") {
                setProductData(
                    response.data.map((item: Product) => ({
                        ...item,
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
        await getListAllowProducts();
    };

    const handleOpenModal = (productId: string) => {
        setSelectedId(productId);
        onOpen();
    };

    useEffect(() => {
        getListAllowProducts();
    }, []);

    const renderCell = useCallback((product: AllowProduct, columnKey: React.Key) => {
        const cellValue = product[columnKey as "registrationCode" | "productName"];

        switch (columnKey) {
            case "registrationCode":
                return <h5 className="font-normal text-black dark:text-white">{product.productCode}</h5>;
            case "productName":
                return <h5 className="font-normal text-black dark:text-white">{product.productName}</h5>;
            case "actions":
                return (
                    <div className="flex items-center justify-center space-x-3.5">
                        <Tooltip content="Chọn">
                            <button
                                className="hover:text-primary"
                                onClick={() => router.push(`/products/details/${product.id}`)}
                            >
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9 19l-7-7 1.414-1.414L9 16.172l12.586-12.586L24 5l-15 15z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    if (loading) return <Loader />;
    else
        return (
            <>
                <ProductHeaderTaskbar
                    sessionToken={sessionToken}
                    dataSearch={dataSearch}
                    setDataSearch={setDataSearch}
                    handleSearch={handleSearch}
                />
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableHeader columns={allowProductColumns}>
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
                            <TableBody items={productData ?? []} emptyContent={"Không có dữ liệu"}>
                                {(item) => (
                                    <TableRow key={item?.id}>
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
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                    <ModalBody>
                                        <p>Bạn có chắc muốn xóa sản phẩm này không</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="default" variant="light" onPress={onClose}>
                                            Hủy
                                        </Button>
                                        <Button
                                            color="danger"
                                            onPress={() => {
                                                onClose();
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </div>
            </>
        );
};

export default ProductsTable;

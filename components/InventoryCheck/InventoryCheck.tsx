"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Tooltip,
    Modal,
    ModalContent,
    useDisclosure,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import Loader from "@/components/common/Loader";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { inventoryCheckColumnsTwo } from "@/utils/data";
import HeaderTaskbar from "@/components/HeaderTaskbar/InventoryCheckHeaderTaskbarTwo/page";
import Unauthorized from "@/components/common/Unauthorized";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import { Product } from "@/types/product";

const InventoryCheckTable = () => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [inventoryCheckData, setInventoryCheckData] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    // const handleDelete = async (inboundId: string) => {
    //     if (loading) {
    //         toast.warning("Hệ thống đang xử lý dữ liệu");
    //         return;
    //     }
    //     setLoading(true);
    //     try {
    //         const response = await deleteInventoryCheck(inboundId, sessionToken);

    //         if (response === "200 OK") {
    //             await getListProductByPage();
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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
            default:
                return cellValue;
        }
    }, []);

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
                                        <TableRow key={item?.id}>
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

                        {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                        <ModalBody>Bạn có chắc muốn xóa phiếu xuất hàng này không?</ModalBody>
                                        <ModalFooter>
                                            <Button color="default" variant="light" onPress={onClose}>
                                                Hủy
                                            </Button>
                                            <Button
                                                color="danger"
                                                onPress={() => {
                                                    handleDelete(selectedId);
                                                    onClose();
                                                }}
                                            >
                                                Xóa
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal> */}
                    </div>
                </>
            );
        }
    }
};

export default InventoryCheckTable;

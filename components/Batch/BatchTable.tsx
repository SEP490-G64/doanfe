"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
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

import { deleteBatch, getListBatch } from "@/services/batchServices";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import { batchColumns } from "@/utils/data";
import { Batch } from "@/types/batch";
import { DataSearch } from "@/types/batch";
import HeaderTaskbar from "@/components/HeaderTaskbar/BatchHeaderTaskbar/page";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";
import { formatDateTime } from "@/utils/methods";
import { getProductById } from "@/services/productServices";
import { Product } from "@/types/product";
import Image from "next/image";

const BatchTable = ({ productId }: { productId?: string }) => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [batchData, setBatchData] = useState<Batch[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [product, setProduct] = useState<Product>();
    const { sessionToken } = useAppContext();
    const [dataSearch, setDataSearch] = useState<DataSearch>({
        productId: productId,
        keyword: "",
        produceStartDate: "",
        produceEndDate: "",
        expireStartDate: "",
        expireEndDate: "",
    });

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const getListBatchByPage = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getListBatch(
                (page - 1).toString(),
                rowsPerPage.toString(),
                dataSearch,
                sessionToken
            );

            if (response.message === "200 OK") {
                setBatchData(
                    response.data.map((item: Batch, index: number) => ({
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

    const handleOpenModal = (batchId: string) => {
        setSelectedId(batchId);
        onOpen();
    };

    const handleSearch = async () => {
        await getListBatchByPage();
        setPage(1);
    };

    const handleDelete = async (batchId: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await deleteBatch(batchId, sessionToken);

            if (response === "200 OK") {
                await getListBatchByPage();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getProductInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getProductById(productId as string, sessionToken);

            if (response.message === "200 OK") {
                setProduct(response.data);
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListBatchByPage();
        getProductInfo();
    }, [page, rowsPerPage]);

    const renderCell = useCallback((batch: Batch, columnKey: React.Key) => {
        const cellValue =
            batch[columnKey as "id" | "batchCode" | "produceDate" | "expireDate" | "inboundPrice" | "actions"];

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{batch.index}</h5>;
            case "batchCode":
                return <h5 className="font-normal text-black dark:text-white">{batch.batchCode}</h5>;
            case "produceDate":
                return <h5 className="font-normal text-black dark:text-white">{formatDateTime(batch.produceDate)}</h5>;
            case "expireDate":
                return <h5 className="font-normal text-black dark:text-white">{formatDateTime(batch.expireDate)}</h5>;
            case "inboundPrice":
                return (
                    <h5 className={`font-normal ${batch.inboundPrice ? "text-black dark:text-white" : "text-red"}`}>
                        {batch.inboundPrice ? `${batch.inboundPrice.toLocaleString()}đ` : "Chưa tính giá nhập hàng"}
                    </h5>
                );
            case "quantity":
                return (
                    <div>
                        <h5 className="font-normal text-black dark:text-white">
                            {batch.quantity} {batch.baseUnit}
                        </h5>
                        {batch.unitConversions && batch.unitConversions.length > 0 && (
                            <>
                                {batch.unitConversions.map((conversion) => (
                                    <h5 key={conversion.id} className="font-normal text-black dark:text-white">
                                        = {conversion.factorConversion * batch.quantity}{" "}
                                        {conversion.smallerUnit?.unitName}
                                    </h5>
                                ))}
                            </>
                        )}
                    </div>
                );
            case "actions":
                return (
                    <div className="flex items-center justify-center space-x-3.5">
                        <Tooltip content="Chi tiết">
                            <button
                                className="hover:text-primary"
                                onClick={() => router.push(`/products/batches/${productId}/details/${batch.id}`)}
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
                        <Tooltip color="secondary" content="Cập nhật" hidden>
                            <button
                                hidden
                                className="hover:text-secondary"
                                onClick={() => router.push(`/products/batches/${productId}/update/${batch.id}`)}
                            >
                                <FaPencil />
                            </button>
                        </Tooltip>
                        <Tooltip color="danger" content="Xóa" hidden>
                            <button className="hover:text-danger" onClick={() => handleOpenModal(batch.id)} hidden>
                                <svg
                                    className="fill-current"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                                        fill=""
                                    />
                                    <path
                                        d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                                        fill=""
                                    />
                                    <path
                                        d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                                        fill=""
                                    />
                                    <path
                                        d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
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
    }, []);

    if (loading) return <Loader />;
    else {
        if (!userInfo?.roles?.some((role) => role.type === "STAFF" || role.type === "MANAGER")) {
            return <Unauthorized></Unauthorized>;
        } else {
            return (
                <>
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Thông tin sản phẩm</h3>
                            <div className="flex gap-4">
                                <Tooltip content={"Thông tin sản phẩm"}>
                                    <button
                                        className="hover:text-primary"
                                        onClick={() => router.push(`/products/details/${productId}`)}
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
                                <Tooltip content={"Quay lại danh sách sản phẩm"}>
                                    <button
                                        className="hover:text-blue-600"
                                        onClick={() => router.push(`/products/list`)}
                                    >
                                        <IoArrowBackSharp color={"blue"} />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className="w-2/12">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Hình ảnh
                                    </label>
                                    {product?.urlImage ? (
                                        <img
                                            src={product.urlImage}
                                            loading={"lazy"}
                                            alt="product-image"
                                            width={64}
                                            height={64}
                                        />
                                    ) : (
                                        <Image
                                            src={"/images/no-image.png"}
                                            loading={"lazy"}
                                            alt="product-image"
                                            width={64}
                                            height={64}
                                        />
                                    )}
                                </div>
                                <div className="w-4/12">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Mã đăng ký
                                    </label>
                                    <input
                                        value={product?.registrationCode}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                                <div className="w-6/12">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Tên sản phẩm
                                    </label>
                                    <input
                                        value={product?.productName}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <br></br>

                    <HeaderTaskbar
                        productId={productId}
                        sessionToken={sessionToken}
                        dataSearch={dataSearch}
                        setDataSearch={setDataSearch}
                        handleSearch={handleSearch}
                    />

                    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                        Tìm thấy <span className="font-bold text-blue-600">{total}</span> lô sản phẩm
                        <div className="max-w-full overflow-x-auto">
                            <Table
                                bottomContent={
                                    totalPages > 0 ? (
                                        <div className="flex w-full justify-between">
                                            <Select
                                                label="Số bản ghi / trang"
                                                selectedKeys={[rowsPerPage.toString()]}
                                                onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
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
                                aria-label="Batch Table"
                            >
                                <TableHeader>
                                    <TableHeader columns={batchColumns}>
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
                                <TableBody items={batchData ?? []} emptyContent={"Không có dữ liệu"}>
                                    {(item) => (
                                        <TableRow key={item?.id}>
                                            {(columnKey) => (
                                                <TableCell
                                                    className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${[].includes(columnKey as string) ? "text-left" : ""}`}
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
                                            <p>Bạn có chắc muốn xóa lô sản phẩm này không?</p>
                                        </ModalBody>
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
                        </Modal>
                    </div>
                </>
            );
        }
    }
};

export default BatchTable;

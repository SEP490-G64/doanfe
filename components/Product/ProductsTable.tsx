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
    TableRow,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaPencil } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation";

import { useAppContext } from "@/components/AppProvider/AppProvider";
import ProductHeaderTaskbar from "@/components/HeaderTaskbar/ProductHeaderTaskbar/page";
import Loader from "@/components/common/Loader";
import { productColumns } from "@/utils/data";
import { DataSearch, Product } from "@/types/product";
import { deleteProduct, getListProduct } from "@/services/productServices";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";
import { FiPackage } from "react-icons/fi";

const ProductsTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<Product[]>([]);
    const [dataSearch, setDataSearch] = useState<DataSearch>({
        keyword: searchParams.get("keyword") || "",
        typeId: searchParams.get("typeId") || "",
        categoryId: searchParams.get("categoryId") || "",
        manufacturerId: searchParams.get("manufacturerId") || "",
        status: searchParams.get("status") || "",
    });

    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { sessionToken } = useAppContext();

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded?.information;

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const getListProductByPage = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getListProduct(
                (page - 1).toString(),
                rowsPerPage.toString(),
                dataSearch,
                sessionToken
            );

            if (response.message === "200 OK") {
                setProductData(
                    response.data.map((item: Product, index: number) => ({
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
        await getListProductByPage();
    };

    const handleOpenModal = (productId: string) => {
        setSelectedId(productId);
        onOpen();
    };

    const handleDelete = async (productId: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await deleteProduct(productId, sessionToken);

            if (response === "200 OK") {
                await getListProductByPage();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListProductByPage();
    }, [page, rowsPerPage]);

    useEffect(() => {
        //Tạo query string từ object dataSearch
        const queryParams = new URLSearchParams({
            ...dataSearch,
            page: page.toString(),
            size: rowsPerPage.toString(),
        }).toString();
        // Chuyển hướng đến đường dẫn mới với query string
        router.push(`/products/list?${queryParams}`);
    }, [dataSearch, page, rowsPerPage, router]);

    const renderCell = useCallback((product: Product, columnKey: React.Key) => {
        const cellValue = product[columnKey as "id"];

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{product.index}</h5>;
            case "urlImage":
                return product.urlImage ? (
                    <img src={product.urlImage} loading={"lazy"} alt="product-image" width={64} height={64} />
                ) : (
                    <Image src={"/images/no-image.png"} loading={"lazy"} alt="product-image" width={64} height={64} />
                );
            case "productName":
                return <h5 className="font-normal text-black dark:text-white">{product.productName}</h5>;
            case "registrationCode":
                return <h5 className="font-normal text-black dark:text-white">{product.registrationCode}</h5>;
            case "categoryName":
                return <h5 className="font-normal text-black dark:text-white">{product.categoryName}</h5>;
            case "typeName":
                return <h5 className="font-normal text-black dark:text-white">{product.typeName}</h5>;
            case "manufacturerName":
                return <h5 className="font-normal text-black dark:text-white">{product.manufacturerName}</h5>;
            case "inboundPrice":
                return (
                    <h5 className={`font-normal ${product.inboundPrice ? "text-black dark:text-white" : "text-red"}`}>
                        {product.inboundPrice ? `${product.inboundPrice.toLocaleString()}đ` : "Chưa tính"}
                    </h5>
                );
            case "sellPrice":
                return (
                    <h5 className={`font-normal ${product.sellPrice ? "text-black dark:text-white" : "text-red"}`}>
                        {product.sellPrice ? `${product.sellPrice.toLocaleString()}đ` : "Chưa quyết định"}
                    </h5>
                );
            case "status":
                return (
                    <p
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${(() => {
                            switch (product.status) {
                                case "CON_HANG":
                                    return "bg-success/10 text-success";
                                case "HET_HANG":
                                    return "bg-warning/10 text-warning";
                                case "NGUNG_KINH_DOANH":
                                    return "bg-danger/10 text-danger";
                            }
                        })()}`}
                    >
                        {(() => {
                            switch (product.status) {
                                case "CON_HANG":
                                    return "Còn hàng";
                                case "HET_HANG":
                                    return "Hết hàng";
                                case "NGUNG_KINH_DOANH":
                                    return "Ngừng kinh doanh";
                            }
                        })()}
                    </p>
                );
            case "unitConversions":
                return (
                    <div>
                        <h5 className="font-normal text-black dark:text-white">
                            {product.quantity} {product.baseUnit}
                        </h5>
                        {product.unitConversions && product.unitConversions.length > 0 && (
                            <>
                                {product.unitConversions.map((conversion) => (
                                    <h5 key={conversion.id} className="font-normal text-black dark:text-white">
                                        = {conversion.factorConversion * product.quantity}{" "}
                                        {conversion.smallerUnit?.unitName}
                                    </h5>
                                ))}
                            </>
                        )}
                    </div>
                );
            case "actions":
                return (
                    <div className="flex flex-col space-y-3.5">
                        <div className="flex flex-row items-center space-x-3.5">
                            <Tooltip content="Chi tiết">
                                <button
                                    className="hover:text-primary"
                                    onClick={() => router.push(`/products/details/${product.id}`)}
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
                            <Tooltip color="secondary" content="Cập nhật">
                                <button
                                    className="hover:text-secondary"
                                    onClick={() => router.push(`/products/update/${product.id}`)}
                                >
                                    <FaPencil />
                                </button>
                            </Tooltip>
                        </div>
                        <div className="flex flex-row items-center space-x-3.5">
                            <Tooltip color="success" content="Xem lô sản phẩm">
                                <button
                                    className="hover:text-secondary"
                                    onClick={() => router.push(`/products/batches/${product.id}`)}
                                >
                                    <FiPackage />
                                </button>
                            </Tooltip>
                            <Tooltip color="danger" content="Xóa">
                                <button className="hover:text-danger" onClick={() => handleOpenModal(product.id)}>
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
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    if (loading) return <Loader />;
    else {
        if (!userInfo?.roles?.some((role) => role.type === "MANAGER" || role.type === "STAFF")) {
            return <Unauthorized></Unauthorized>;
        }
        return (
            <>
                <ProductHeaderTaskbar
                    sessionToken={sessionToken}
                    buttons={"import"}
                    dataSearch={dataSearch}
                    setDataSearch={setDataSearch}
                    handleSearch={handleSearch}
                />
                <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                    Tìm thấy <span className="font-bold text-blue-600">{total}</span> sản phẩm
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
                            <TableHeader columns={productColumns}>
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
                            <TableBody items={productData ?? []} emptyContent={"Không có dữ liệu"}>
                                {(item) => (
                                    <TableRow key={item.id}>
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
};

export default ProductsTable;

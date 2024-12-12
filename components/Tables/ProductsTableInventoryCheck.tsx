"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
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

import IconButton from "../UI/IconButton";
import { formatDateTimeDDMMYYYYHHMM, formatDateTimeYYYYMMDD } from "@/utils/methods";
import { ProductCheckType } from "@/lib/schemaValidate/inventoryCheckSchema";
import { ProductChangedHistory } from "@/types/inventoryCheck";
import { getProductsChangedHistory } from "@/services/productServices";

const ProductsTableInventoryCheck = ({
    data,
    active,
    startedDate,
    sessionToken,
    setProducts,
    errors,
}: {
    data: ProductCheckType[];
    active: boolean;
    startedDate: string;
    sessionToken: string;
    errors: any;
    setProducts: any;
}) => {
    const [productsChanged, setProductsChanged] = useState<ProductChangedHistory[]>([]);
    const [changedQuantity, setChangedQuantity] = useState<number>(0);
    const [indexProduct, setIndexProduct] = useState<number>(-1);
    const [showHistoryChanged, setShowHistoryChanged] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<number>(-1);
    const [batchErrors, setBatchErrors] = useState<number[]>([]);

    const removeItem = (index: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex(index);
        setShowHistoryChanged(false);
        onOpen();
    };

    const handleDelete = () => {
        data.splice(removedItemIndex, 1);
        setProducts("inventoryCheckProductDetails", data);
    };

    const getProductsChanged = async (productId: number, batchCode: string | undefined) => {
        try {
            const response = await getProductsChangedHistory(startedDate, productId, sessionToken);

            if (response.status === "SUCCESS") {
                let products = response.data;
                if (batchCode)
                    products = products.filter((product: ProductChangedHistory) => product.batch === batchCode);
                // else products = products.filter((product: ProductChangedHistory) => !product.batch);
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
                // if (product.productId === code && !product.batch) {
                if (product.productId === code) {
                    quantity += product.transactionType === "INBOUND" ? product.quantity : -product.quantity;
                }
            }
        });
        return quantity;
    };

    const handleChangeBatchCode = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const batch = data[index].batches?.find((b) => b.batchCode === e.target.value);
        data![index]!.batch!.id = batch?.id;
        data![index]!.batch!.batchCode = batch?.batchCode;
        data![index]!.batch!.expireDate = batch?.expireDate;
        if (batch) {
            data![index]!.systemQuantity = batch?.quantity;
            if (data![index].countedQuantity && data![index]!.systemQuantity)
                data![index].difference = data![index].countedQuantity - data![index]!.systemQuantity;
        } else {
            data![index]!.systemQuantity = data![index]!.productQuantity;
            if (data![index].countedQuantity && data![index]!.systemQuantity)
                data![index].difference = data![index].countedQuantity - data![index]!.systemQuantity;
        }
        if (data) {
            let duplicate = false;
            data.forEach((d, dindex) => {
                if (d.batch?.batchCode === e.target.value && dindex !== index) {
                    duplicate = true;
                }
            });
            if (duplicate) setBatchErrors([...batchErrors, index]);
            else setBatchErrors(batchErrors.filter((i) => i !== index));
            errors.inventoryCheckProductDetails = duplicate;
        }
        setProducts("inventoryCheckProductDetails", data);
    };

    const handleChangeSystemQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].systemQuantity = Number(e.target.value.replace(/,/g, ""));
        if (data![index].countedQuantity)
            data![index].difference = Number(e.target.value.replace(/,/g, "")) - data![index].countedQuantity;
        setProducts("inventoryCheckProductDetails", data);
    };

    const handleChangeCountedQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].countedQuantity = Number(e.target.value.replace(/,/g, ""));
        if (data![index].systemQuantity)
            data![index].difference = data![index].systemQuantity - Number(e.target.value.replace(/,/g, ""));
        setProducts("inventoryCheckProductDetails", data);
    };

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

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
            <table className="w-full table-auto">
                <thead className="rounded-sm bg-gray-2 text-left">
                    <tr>
                        <th className="p-4 text-center font-medium text-black">STT</th>
                        {/*<th className="p-4 text-center font-medium text-black">Ảnh</th>*/}
                        <th className="p-4 text-center font-medium text-black">Tên sản phẩm</th>
                        <th className="p-4 text-center font-medium text-black">Đơn vị</th>
                        <th className="p-4 text-center font-medium text-black">Mã lô</th>
                        <th className="p-4 text-center font-medium text-black">Tồn trên hệ thống</th>
                        <th className="p-4 text-center font-medium text-black">Tồn thực tế</th>
                        <th className="p-4 text-center font-medium text-black">Chênh lệch</th>
                        <th className="p-4 text-center font-medium text-black">Hạn sử dụng</th>
                        <th className="p-4 text-center font-medium text-black">Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((product, key) => (
                        <tr key={key} className="text-left">
                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <p className="text-meta-5">{key + 1}</p>
                            </td>

                            {/*<td className="border-b border-[#eee] px-4 py-5 text-center">*/}
                            {/*    <div className="flex items-center justify-center">*/}
                            {/*        <Image src={product?.image} alt="product-image" width={48} height={48} />*/}
                            {/*    </div>*/}
                            {/*</td>*/}

                            <td className="border-b border-[#eee] px-4 py-5 text-left">
                                <p className="text-black dark:text-white">{product?.productName}</p>
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="text"
                                    defaultValue={
                                        product?.productBaseUnit?.unitName ? product?.productBaseUnit.unitName : ""
                                    }
                                    disabled={!active}
                                    className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                            </td>

                            {product?.batches && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <select
                                        value={product?.batch?.batchCode}
                                        onChange={(e) => handleChangeBatchCode(e, key)}
                                        className={`w-full min-w-[40px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition`}
                                    >
                                        <option value="" className="text-black dark:text-white">
                                            Chọn lô
                                        </option>
                                        {product?.batches.map((batch) => (
                                            <option
                                                key={batch.id}
                                                value={batch.batchCode}
                                                className="text-black dark:text-white"
                                            >
                                                {batch.batchCode}
                                            </option>
                                        ))}
                                    </select>
                                    {batchErrors.includes(key) && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">Trùng mã lô</span>
                                    )}
                                </td>
                            )}

                            {!product?.batches && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="text"
                                        value={product?.batch?.batchCode}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="text"
                                    value={product?.systemQuantity?.toLocaleString() || ""}
                                    disabled
                                    onChange={(e) => handleChangeSystemQuantity(e, key)}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                                {errors.inventoryCheckProductDetails?.[key]?.batch?.systemQuantity && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.inventoryCheckProductDetails?.[key]?.batch?.systemQuantity.message}
                                    </span>
                                )}
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="text"
                                    value={product?.countedQuantity?.toLocaleString() || ""}
                                    disabled={!active}
                                    onChange={(e) => handleChangeCountedQuantity(e, key)}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                                {errors.inventoryCheckProductDetails?.[key]?.batch?.countedQuantity && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.inventoryCheckProductDetails?.[key]?.batch?.countedQuantity.message}
                                    </span>
                                )}
                            </td>

                            {/* <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="number"
                                    value={product?.discount}
                                    disabled={!active}
                                    onChange={(e) => handleChangeDiscount(e, key)}
                                    className="w-8 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                                <p className="inline text-meta-5">%</p>
                            </td> */}

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="text"
                                    value={product?.difference?.toLocaleString() || ""}
                                    disabled
                                    className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="date"
                                    value={formatDateTimeYYYYMMDD(product?.batch?.expireDate)}
                                    disabled
                                    className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <Tooltip content="Chi tiết">
                                    <button
                                        className="hover:text-primary"
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            setShowHistoryChanged(true);
                                            setIndexProduct(key);
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
                            </td>

                            {/*<td className="border-b border-[#eee] px-4 py-5 text-center">*/}
                            {/*    <p className="text-meta-5">*/}
                            {/*        {product?.price &&*/}
                            {/*            product?.systemQuantity &&*/}
                            {/*            product?.discount &&*/}
                            {/*            `${(product?.price * product?.systemQuantity * (100 - product?.discount)) / 100}`}*/}
                            {/*    </p>*/}
                            {/*</td>*/}

                            {active && data.length > 1 && (
                                <td>
                                    <IconButton
                                        icon={<IoTrashBinOutline />}
                                        size="small"
                                        type="danger"
                                        onClick={(e) => removeItem(key, e)}
                                    />
                                </td>
                            )}
                            {/* {active && (
                                <td>
                                    <IconButton
                                        icon={<FaPlus />}
                                        size="small"
                                        type="primary"
                                        onClick={(e) => addBatch(key, e)}
                                    />
                                </td>
                            )} */}
                        </tr>
                    ))}
                    <tr>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        {/*<td className="border-b border-[#eee] px-4 py-5 text-right text-danger">Tổng</td>*/}
                        {/*<td className="border-b border-[#eee] px-4 py-5 text-center text-danger">*/}
                        {/*    {data.reduce((prev, curr) => prev + curr.total, 0)}*/}
                        {/*</td>*/}
                    </tr>
                </tbody>
            </table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{ base: "min-w-[820px]" }}>
                <ModalContent>
                    {(onClose) =>
                        showHistoryChanged ? (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Danh sách sản phẩm có sự thay đổi
                                </ModalHeader>
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
                                        {active && (
                                            <label>
                                                Nhập số lượng thực tế{" "}
                                                <input
                                                    value={data[indexProduct]?.countedQuantity || ""}
                                                    type="number"
                                                    onChange={(e) => handleChangeCountedQuantity(e, indexProduct)}
                                                    className="w-30 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            if (changedQuantity && data![indexProduct].countedQuantity) {
                                                data![indexProduct].countedQuantity -= changedQuantity;
                                                if (data![indexProduct].systemQuantity) {
                                                    data![indexProduct].difference =
                                                        data![indexProduct].systemQuantity -
                                                        data![indexProduct].countedQuantity;
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
                        ) : (
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
                                            handleDelete();
                                            onClose();
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ProductsTableInventoryCheck;

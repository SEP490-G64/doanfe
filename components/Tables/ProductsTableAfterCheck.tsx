"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import IconButton from "../UI/IconButton";
import { ProductInboundType } from "@/lib/schemaValidate/inboundSchema";
import { formatDateTimeYYYYMMDD } from "@/utils/methods";

const ProductsTableAfterCheck = ({
    data,
    active,
    setProducts,
    errors,
}: {
    data: ProductInboundType[];
    active: boolean;
    errors: any;
    setProducts: any;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<[number, number]>([-1, -1]);
    const [batchErrors, setBatchErrors] = useState<number[]>([]);

    const removeItem = (index: number, bIndex: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex([index, bIndex]);
        onOpen();
    };

    const addBatch = (index: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        data[index].batches!.push({
            batchCode: undefined,
            inboundBatchQuantity: 1,
            inboundPrice: 1,
            expireDate: undefined,
        });
        setProducts("productInbounds", data);
    };

    const handleDelete = () => {
        data[removedItemIndex[0]].batches!.splice(removedItemIndex[1], 1);
        setProducts("productInbounds", data);
    };

    const handleChangeBatchCode = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data[index].batches![batchIndex].batchCode = e.target.value;
        if (data[index].batches) {
            let duplicate = false;
            data[index].batches.forEach((b, index) => {
                if (b.batchCode === e.target.value && batchIndex !== index) {
                    duplicate = true;
                }
            });
            if (duplicate) setBatchErrors([...batchErrors, index]);
            else setBatchErrors(batchErrors.filter((i) => i !== index));
            errors.productInbounds = duplicate;
        }
        setProducts("productInbounds", data);
    };

    const handleChangeInboundPrice = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data![index].batches![batchIndex]!.inboundPrice = Number(e.target.value);
        setProducts("productInbounds", data);
    };

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data![index].batches![batchIndex]!.inboundBatchQuantity = Number(e.target.value);
        setProducts("productInbounds", data);
    };

    const handleChangeExpiredDate = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        const date = new Date(e.target.value);
        data![index].batches![batchIndex].expireDate = date.toISOString();
        setProducts("productInbounds", data);
    };

    const handleChangeDiscount = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].discount = Number(e.target.value);
        setProducts("productInbounds", data);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
            <table className="w-full table-auto">
                <thead className="rounded-sm bg-gray-2 text-left">
                    <tr>
                        <th className="p-4 text-center font-medium text-black">STT</th>
                        {/*<th className="p-4 text-center font-medium text-black">Ảnh</th>*/}
                        <th className="p-4 text-center font-medium text-black">Tên sản phẩm</th>
                        <th className="p-4 text-center font-medium text-black">Đơn vị</th>
                        <th className="p-4 text-center font-medium text-black">Số lượng đặt</th>
                        <th className="p-4 text-center font-medium text-black">Chiết khấu</th>
                        <th className="p-4 text-center font-medium text-black">Mã lô</th>
                        <th className="p-4 text-center font-medium text-black">Số lượng nhập</th>
                        <th className="p-4 text-center font-medium text-black">Đơn giá</th>
                        <th className="p-4 text-center font-medium text-black">Hạn sử dụng</th>
                        {/*<th className="p-4 text-center font-medium text-black">Thành tiền</th>*/}
                    </tr>
                </thead>

                <tbody>
                    {data.map(
                        (product, key) =>
                            product.batches &&
                            product.batches.map((batch, bIndex) => (
                                <tr key={`${key}.${bIndex}`} className="text-left">
                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <p className="text-meta-5">{`${key + 1}.${bIndex + 1}`}</p>
                                    </td>

                                    {/*<td className="border-b border-[#eee] px-4 py-5 text-center">*/}
                                    {/*    <div className="flex items-center justify-center">*/}
                                    {/*        <Image src={product.image} alt="product-image" width={48} height={48} />*/}
                                    {/*    </div>*/}
                                    {/*</td>*/}

                                    <td className="border-b border-[#eee] px-4 py-5 text-left">
                                        <p className="text-black dark:text-white">{product.productName}</p>
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            defaultValue={product.baseUnit.unitName ? product.baseUnit.unitName : ""}
                                            disabled={!active}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            defaultValue={product.requestQuantity ? product.requestQuantity : ""}
                                            disabled
                                            className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="number"
                                            value={product.discount}
                                            disabled={!active}
                                            onChange={(e) => handleChangeDiscount(e, key)}
                                            className="w-8 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        <p className="inline text-meta-5">%</p>
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.batchCode}
                                            disabled={!active}
                                            onChange={(e) => handleChangeBatchCode(e, key, bIndex)}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        {batchErrors.includes(key) && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">Trùng mã lô</span>
                                        )}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="number"
                                            value={batch.inboundBatchQuantity}
                                            disabled={!active}
                                            onChange={(e) => handleChangeQuantity(e, key, bIndex)}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        {errors.productInbounds?.[key]?.batches?.[bIndex]?.inboundBatchQuantity && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {
                                                    errors.productInbounds?.[key]?.batches?.[bIndex]
                                                        ?.inboundBatchQuantity.message
                                                }
                                            </span>
                                        )}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="number"
                                            value={batch.inboundPrice}
                                            disabled={!active}
                                            onChange={(e) => handleChangeInboundPrice(e, key, bIndex)}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        {errors.productInbounds?.[key]?.batches?.[bIndex]?.inboundPrice && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.productInbounds?.[key]?.batches?.[bIndex]?.inboundPrice.message}
                                            </span>
                                        )}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="date"
                                            value={formatDateTimeYYYYMMDD(batch.expireDate)}
                                            disabled={!active}
                                            onChange={(e) => handleChangeExpiredDate(e, key, bIndex)}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    {/*<td className="border-b border-[#eee] px-4 py-5 text-center">*/}
                                    {/*    <p className="text-meta-5">*/}
                                    {/*        {batch.inboundPrice &&*/}
                                    {/*            batch.inboundBatchQuantity &&*/}
                                    {/*            product.discount &&*/}
                                    {/*            `${(batch.inboundPrice * batch.inboundBatchQuantity * (100 - product.discount)) / 100}`}*/}
                                    {/*    </p>*/}
                                    {/*</td>*/}

                                    {active && data[key].batches!.length > 1 && (
                                        <td>
                                            <IconButton
                                                icon={<IoTrashBinOutline />}
                                                size="small"
                                                type="danger"
                                                onClick={(e) => removeItem(key, bIndex, e)}
                                            />
                                        </td>
                                    )}
                                    {active && (
                                        <td>
                                            <IconButton
                                                icon={<FaPlus />}
                                                size="small"
                                                type="primary"
                                                onClick={(e) => addBatch(key, e)}
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))
                    )}
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
                                        handleDelete();
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
    );
};

export default ProductsTableAfterCheck;

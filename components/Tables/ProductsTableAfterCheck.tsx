"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import IconButton from "../UI/IconButton";
import { ProductInboundType } from "@/lib/schemaValidate/inboundSchema";

const ProductsTableAfterCheck = ({
    data,
    active,
    setProducts,
}: {
    data: ProductInboundType[];
    active: boolean;
    setProducts: any;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<number>(-1);
    const removeItem = (index: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex(index);
        onOpen();
    };

    const handleDelete = () => {
        data.splice(removedItemIndex, 1);
        setProducts("productInbounds", data);
    };

    const handleChangeBatchCode = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data[index].batchList![batchIndex].batchCode = e.target.value;
        console.log(data);
        setProducts("productInbounds", data);
    };

    const handleChangeInboundPrice = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data![index].batchList![batchIndex]!.inboundPrice = Number(e.target.value);
        setProducts("productInbounds", data);
    };

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data![index].batchList![batchIndex]!.inboundBatchQuantity = Number(e.target.value);
        setProducts("productInbounds", data);
    };

    const handleChangeExpiredDate = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        data![index].batchList![batchIndex].expireDate = e.target.value;
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
                        <th className="p-4 text-center font-medium text-black">Số lượng</th>
                        <th className="p-4 text-center font-medium text-black">Đơn giá</th>
                        <th className="p-4 text-center font-medium text-black">Hạn sử dụng</th>
                        {/*<th className="p-4 text-center font-medium text-black">Thành tiền</th>*/}
                    </tr>
                </thead>

                <tbody>
                    {data.map(
                        (product, key) =>
                            product.batchList &&
                            product.batchList.map((batch, bIndex) => (
                                <tr key={key} className="text-left">
                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <p className="text-meta-5">{key + 1}</p>
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
                                            value={product.baseUnit.unitName}
                                            disabled={!active}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={product.requestQuantity}
                                            disabled
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <p className="text-meta-5">{product.discount ? product.discount : ""}%</p>
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.batchCode}
                                            disabled={!active}
                                            onChange={(e) => handleChangeBatchCode(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.inboundBatchQuantity}
                                            disabled={!active}
                                            onChange={(e) => handleChangeQuantity(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.inboundPrice}
                                            disabled={!active}
                                            onChange={(e) => handleChangeInboundPrice(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.expireDate}
                                            disabled={!active}
                                            onChange={(e) => handleChangeExpiredDate(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
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

                                    {active && (
                                        <td>
                                            <IconButton
                                                icon={<IoTrashBinOutline />}
                                                size="small"
                                                type="danger"
                                                onClick={(e) => removeItem(key, e)}
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))
                    )}
                    {data.map(
                        (product, key) =>
                            product.batches &&
                            product.batches.map((batch, bIndex) => (
                                <tr key={key} className="text-left">
                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <p className="text-meta-5">{key + 1}</p>
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
                                            value={product.baseUnit.unitName}
                                            disabled={!active}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={product.requestQuantity}
                                            disabled
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <p className="text-meta-5">{product.discount ? product.discount : ""}%</p>
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.batchCode}
                                            disabled={!active}
                                            onChange={(e) => handleChangeBatchCode(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.inboundBatchQuantity}
                                            disabled={!active}
                                            onChange={(e) => handleChangeQuantity(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.inboundPrice}
                                            disabled={!active}
                                            onChange={(e) => handleChangeInboundPrice(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.expireDate}
                                            disabled={!active}
                                            onChange={(e) => handleChangeExpiredDate(e, key, bIndex)}
                                            className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
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

                                    {active && (
                                        <td>
                                            <IconButton
                                                icon={<IoTrashBinOutline />}
                                                size="small"
                                                type="danger"
                                                onClick={(e) => removeItem(key, e)}
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

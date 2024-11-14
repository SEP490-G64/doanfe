"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import IconButton from "../UI/IconButton";
import { formatDateTimeYYYYMMDD } from "@/utils/methods";
import { ProductOutboundType } from "@/lib/schemaValidate/outboundSchema";

const ProductsTableOutbound = ({
    data,
    active,
    outboundType,
    setProducts,
    errors,
}: {
    data: ProductOutboundType[];
    active: boolean;
    outboundType: string | undefined;
    errors: any;
    setProducts: any;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<number>(-1);
    const [batchErrors, setBatchErrors] = useState<number[]>([]);

    const removeItem = (index: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex(index);
        onOpen();
    };

    // const addBatch = (index: number, e?: React.MouseEvent) => {
    //     e!.preventDefault();
    //     data[index].batches!.push({
    //         batchCode: undefined,
    //         outboundBatchQuantity: 0,
    //         outboundPrice: 0,
    //         expireDate: undefined,
    //     });
    //     setProducts("outboundProductDetails", data);
    // };

    const handleDelete = () => {
        data.splice(removedItemIndex, 1);
        setProducts("outboundProductDetails", data);
    };

    const handleChangeBatchCode = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const batch = data[index].batches?.find((b) => b.batchCode === e.target.value);
        data[index].batch.id = batch?.id;
        data[index].batch.batchCode = batch?.batchCode;
        data[index].batch.expireDate = batch?.expireDate;
        data[index].price = batch?.inboundPrice;
        if (data) {
            let duplicate = false;
            data.forEach((d, dindex) => {
                if (d.batch.batchCode === e.target.value && dindex !== index) {
                    duplicate = true;
                }
            });
            if (duplicate) setBatchErrors([...batchErrors, index]);
            else setBatchErrors(batchErrors.filter((i) => i !== index));
            errors.outboundProductDetails = duplicate;
        }
        setProducts("outboundProductDetails", data);
    };

    const handleChangeUnit = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        data[index].targetUnit!.id = Number(e.target.value);
        setProducts("outboundProductDetails", data);
    };

    const handleChangeOutboundPrice = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].price = Number(e.target.value);
        setProducts("outboundProductDetails", data);
    };

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].outboundQuantity = Number(e.target.value);
        setProducts("outboundProductDetails", data);
    };

    // const handleChangeExpiredDate = (index: number, expireDate?: string) => {
    //     if (!expireDate) return;
    //     const date = new Date(expireDate);
    //     data![index].batch.expireDate = date.toISOString();
    //     setProducts("outboundProductDetails", data);
    // };

    // const handleChangeDiscount = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    //     data![index].discount = Number(e.target.value);
    //     setProducts("outboundProductDetails", data);
    // };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
            <table className="w-full table-auto">
                <thead className="rounded-sm bg-gray-2 text-left">
                    <tr>
                        <th className="p-4 text-center font-medium text-black">STT</th>
                        {/*<th className="p-4 text-center font-medium text-black">Ảnh</th>*/}
                        <th className="p-4 text-center font-medium text-black">Tên sản phẩm</th>
                        {outboundType !== "BAN_HANG" && (
                            <th className="p-4 text-center font-medium text-black">Đơn vị</th>
                        )}
                        {outboundType !== "BAN_HANG" && (
                            <th className="p-4 text-center font-medium text-black">Mã lô</th>
                        )}
                        {outboundType === "BAN_HANG" && (
                            <th className="p-4 text-center font-medium text-black">Đơn vị xuất</th>
                        )}
                        <th className="p-4 text-center font-medium text-black">Số lượng xuất</th>
                        <th className="p-4 text-center font-medium text-black">Đơn giá</th>
                        {/* <th className="p-4 text-center font-medium text-black">Chiết khấu</th> */}
                        {outboundType !== "BAN_HANG" && (
                            <th className="p-4 text-center font-medium text-black">Hạn sử dụng</th>
                        )}
                        {/*<th className="p-4 text-center font-medium text-black">Thành tiền</th>*/}
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
                                <p className="text-black dark:text-white">{product?.product?.productName}</p>
                            </td>

                            {outboundType !== "BAN_HANG" && (
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
                            )}

                            {outboundType !== "BAN_HANG" && product?.batches && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <select
                                        value={product?.batch.batchCode}
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

                            {outboundType !== "BAN_HANG" && !product?.batches && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="text"
                                        value={product?.batch.batchCode}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            {outboundType === "BAN_HANG" && product?.productUnits && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <select
                                        value={product?.targetUnit?.id}
                                        onChange={(e) => handleChangeUnit(e, key)}
                                        className={`w-full min-w-[40px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition`}
                                    >
                                        <option value="" className="text-black dark:text-white">
                                            Chọn đơn vị xuất
                                        </option>
                                        {product?.productUnits.map((unit) => (
                                            <option
                                                key={unit.id}
                                                value={unit.id}
                                                className="text-black dark:text-white"
                                            >
                                                {unit.unitName}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            )}

                            {outboundType === "BAN_HANG" && !active && product?.targetUnit?.unitName && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="text"
                                        value={product?.targetUnit?.unitName}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="number"
                                    value={product?.outboundQuantity}
                                    disabled={!active}
                                    onChange={(e) => handleChangeQuantity(e, key)}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                                {errors.outboundProductDetails?.[key]?.batch?.outboundQuantity && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.outboundProductDetails?.[key]?.batch?.outboundQuantity.message}
                                    </span>
                                )}
                            </td>

                            {outboundType !== "BAN_HANG" ? (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="number"
                                        value={product?.price}
                                        disabled={!active}
                                        onChange={(e) => handleChangeOutboundPrice(e, key)}
                                        className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                    {errors.outboundProductDetails?.[key]?.batch?.price && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {errors.outboundProductDetails?.[key]?.batch?.price.message}
                                        </span>
                                    )}
                                </td>
                            ) : (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="number"
                                        defaultValue={product?.sellPrice || product?.price}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

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

                            {outboundType !== "BAN_HANG" && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="date"
                                        value={formatDateTimeYYYYMMDD(product?.batch.expireDate)}
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            {/*<td className="border-b border-[#eee] px-4 py-5 text-center">*/}
                            {/*    <p className="text-meta-5">*/}
                            {/*        {product?.price &&*/}
                            {/*            product?.outboundQuantity &&*/}
                            {/*            product?.discount &&*/}
                            {/*            `${(product?.price * product?.outboundQuantity * (100 - product?.discount)) / 100}`}*/}
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

export default ProductsTableOutbound;

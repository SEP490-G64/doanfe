"use client";
import React, { useEffect, useState } from "react";
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
                                     taxable,
                                     totalPrice,
                                     onTotalPriceChange,
                                 }: {
    data: ProductInboundType[];
    active: boolean;
    errors: any;
    setProducts: any;
    taxable: boolean;
    totalPrice: any;
    onTotalPriceChange: any;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<[number, number]>([-1, -1]);
    const [batchErrors, setBatchErrors] = useState<number[]>([]);
    const [totalPricing, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const total = calculateTotalPrice(data);  // Tính tổng tiền khi dữ liệu thay đổi
        setTotalPrice(total);
        onTotalPriceChange(total);  // Gửi giá trị tổng tiền về parent component
    }, [data, onTotalPriceChange]);

    // Tính tổng tiền sau chiết khấu và thuế
    const calculateTotalPrice = (products: ProductInboundType[]) => {
        return products.reduce((total, product) => {
            const productTotal = product.batches?.reduce((batchTotal, batch) => {
                return batchTotal + calculateTotalWithDiscount(batch, product);
            }, 0) || 0;
            return total + productTotal;
        }, 0);
    };

    // Tính toán tổng tiền của một batch sau chiết khấu và thuế
    const calculateTotalWithDiscount = (batch: any, product: any) => {
        const quantity = batch.inboundBatchQuantity || product.receiveQuantity;
        const price = batch.inboundPrice || product.price;
        const taxRate = product.taxRate || 0;  // Tỷ lệ thuế (%)
        const discount = product.discount || 0;  // Chiết khấu (%)

        const total = quantity * price || 0;  // Tổng tiền ban đầu (chưa chiết khấu, chưa thuế)
        const totalAfterDiscount = total * (1 - discount / 100);  // Tổng tiền sau chiết khấu
        const taxAmount = totalAfterDiscount * (taxRate / 100);  // Số tiền thuế

        return totalAfterDiscount + taxAmount;  // Tổng tiền sau chiết khấu và bao gồm thuế
    };
    
    const removeItem = (index: number, bIndex: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex([index, bIndex]);
        onOpen();
    };

    const addBatch = (index: number, e?: React.MouseEvent) => {
        e?.preventDefault();

        // Thêm batch mới vào danh sách batches
        const newBatch = {
            batchCode: "", // Mã lô mặc định trống
            inboundBatchQuantity: 0,
            inboundPrice: 0,
            expireDate: undefined,
        };
        data[index].batches!.push(newBatch);

        // Biến kiểm tra lỗi
        let duplicate = false;
        let emptyBatchCode = false;
        let lengthExceeded = false; // Biến kiểm tra độ dài mã lô

        // Duyệt qua tất cả các batch của product
        const batches = data[index].batches;

        // Lặp qua tất cả các batch và kiểm tra lỗi
        const updatedBatchErrors = { ...batchErrors };

        batches?.forEach((batch, batchIndex) => {
            const batchCode = batch.batchCode?.trim() || "";

            // Kiểm tra lỗi cho batch
            emptyBatchCode = !batchCode; // Lỗi nếu batchCode trống
            lengthExceeded = batchCode.length > 100; // Lỗi nếu độ dài mã lô vượt quá 100 ký tự

            // Chỉ kiểm tra ngày hết hạn khi batchCode không trống
            const emptyExpireDate = batchCode && !batch.expireDate; // Lỗi nếu không có ngày hết hạn và batchCode không trống

            // Kiểm tra trùng lặp batchCode chỉ khi batchCode không trống
            duplicate = batchCode && batches.some((b, otherIndex) => (
                otherIndex !== batchIndex && // Không so với chính batch này
                b.batchCode?.trim().toLowerCase() === batchCode.toLowerCase() // Kiểm tra trùng lặp batchCode
            ));

            // Cập nhật lỗi cho batch
            updatedBatchErrors[index] = updatedBatchErrors[index] || {};
            updatedBatchErrors[index][batchIndex] = {
                duplicate,
                emptyBatchCode,
                emptyExpireDate,
                lengthExceeded,
            };
        });

        // Cập nhật lại batchErrors sau khi kiểm tra tất cả các batch
        setBatchErrors(updatedBatchErrors);

        // Cập nhật lại giá trị của productInbounds
        setProducts("productInbounds", data);
    };

    const handleDelete = () => {
        const [index, batchIndex] = removedItemIndex;

        // Xóa batch trong danh sách batches
        data[index].batches!.splice(batchIndex, 1);

        // Xử lý lại lỗi của các batches sau khi xóa
        const updatedBatches = data[index].batches;
        const updatedBatchErrors = { ...batchErrors };

        if (updatedBatches?.length === 1) {
            // Nếu không còn batch nào, xóa lỗi của product này
            delete updatedBatchErrors[index];
        } else {
            // Cập nhật lại lỗi cho các batches còn lại
            updatedBatchErrors[index] = updatedBatches?.map((batch, i) => {
                let duplicate = false;
                let emptyBatchCode = false;
                let emptyExpireDate = false;
                let lengthExceeded = false; // Kiểm tra độ dài mã lô

                // Kiểm tra lỗi cho batch hiện tại
                const batchCode = batch.batchCode?.trim() || "";
                if (!batchCode) {
                    emptyBatchCode = true;
                }

                if (batchCode && !batch.expireDate) {
                    emptyExpireDate = true;
                }

                // Kiểm tra độ dài mã lô không vượt quá 100 ký tự
                if (batchCode.length > 100) {
                    lengthExceeded = true;
                }

                // Kiểm tra trùng lặp batchCode
                updatedBatches.forEach((b, otherIndex) => {
                    if (
                        i !== otherIndex &&
                        b.batchCode &&
                        b.batchCode.trim().toLowerCase() === batchCode.toLowerCase()
                    ) {
                        duplicate = true;
                    }
                });

                return {
                    duplicate,
                    emptyBatchCode,
                    emptyExpireDate,
                    lengthExceeded, // Thêm lỗi độ dài vào batch
                };
            });
        }

        // Cập nhật batchErrors
        setBatchErrors(updatedBatchErrors);

        // Cập nhật lại danh sách sản phẩm
        setProducts("productInbounds", data);
    };

    const handleChangeBatchCode = (e: React.ChangeEvent<HTMLInputElement>, index: number, batchIndex: number) => {
        const newBatchCode = e.target.value.trim(); // Lấy giá trị mã lô và loại bỏ khoảng trắng đầu/cuối
        data[index].batches![batchIndex].batchCode = newBatchCode;

        // Kiểm tra nếu số lượng batch nhỏ hơn 1, không cần kiểm tra lỗi
        if (!data[index].batches || data[index].batches.length <= 1) {
            // Reset lỗi cho batch hiện tại
            setBatchErrors((prevErrors) => ({
                ...prevErrors,
                [index]: {
                    ...prevErrors[index],
                    [batchIndex]: {
                        duplicate: false,
                        emptyBatchCode: false,
                        emptyExpireDate: false,
                        lengthExceeded: false,
                    },
                },
            }));

            // Cập nhật trạng thái lỗi tổng thể
            errors.productInbounds = false;

            // Cập nhật lại giá trị của productInbounds
            setProducts("productInbounds", data);
            return; // Thoát hàm
        }

        // Biến kiểm tra lỗi
        let duplicate = false;
        let emptyBatchCode = false;
        let emptyExpireDate = false;
        let lengthExceeded = false;

        // Kiểm tra trùng mã lô, mã lô trống và độ dài
        if (data[index].batches) {
            data[index].batches.forEach((b, i) => {
                // Kiểm tra trùng mã lô với các batch khác (không tính batch hiện tại)
                if (b.batchCode && b.batchCode.trim() !== "" && b.batchCode.toLowerCase() === newBatchCode.toLowerCase() && batchIndex !== i) {
                    duplicate = true;
                }

                // Kiểm tra mã lô trống hoặc không có giá trị
                if (!b.batchCode || b.batchCode.trim() === "" || b.batchCode === undefined) {
                    emptyBatchCode = true;
                }

                // Chỉ kiểm tra ngày hết hạn nếu mã lô không trống
                if (b.batchCode && b.batchCode.trim() !== "" && !b.expireDate) {
                    emptyExpireDate = true;
                }
            });

            // Kiểm tra độ dài mã lô
            if (newBatchCode.length > 100) {
                lengthExceeded = true;
            }

            // Cập nhật lỗi vào batchErrors theo index và batchIndex
            setBatchErrors((prevErrors) => ({
                ...prevErrors,
                [index]: {
                    ...prevErrors[index],
                    [batchIndex]: {
                        duplicate,
                        emptyBatchCode,
                        emptyExpireDate,
                        lengthExceeded,
                    },
                },
            }));

            // Cập nhật lỗi cho phần productInbounds
            errors.productInbounds = duplicate || emptyBatchCode || emptyExpireDate || lengthExceeded;
        }

        // Cập nhật lại giá trị của productInbounds
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

        // Kiểm tra nếu có mã lô mà ngày hết hạn lại bị trống
        let emptyExpireDate = false;
        let invalidExpireDate = false; // Cờ kiểm tra ngày hết hạn không hợp lệ

        // Kiểm tra nếu mã lô có giá trị mà ngày hết hạn trống
        if (data![index].batches![batchIndex].batchCode && (!data![index].batches![batchIndex].expireDate || data![index].batches![batchIndex].expireDate === undefined)) {
            emptyExpireDate = true;
        }

        // Lấy ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00 để so sánh chỉ ngày

        // Kiểm tra nếu ngày hết hạn trước ngày hôm nay
        if (date < today) {
            invalidExpireDate = true; // Ngày hết hạn trước hôm nay
        }

        // Kiểm tra nếu ngày hết hạn quá lớn (ví dụ: quá 10 năm sau)
        const maxExpireDate = new Date();
        maxExpireDate.setFullYear(today.getFullYear() + 10); // Giới hạn ngày hết hạn tối đa là 10 năm sau

        if (date > maxExpireDate) {
            invalidExpireDate = true; // Ngày hết hạn quá lớn
        }

        // Cập nhật lỗi vào batchErrors cho batch này
        setBatchErrors((prevErrors) => ({
            ...prevErrors,
            [index]: {
                ...prevErrors[index],
                [batchIndex]: {
                    ...prevErrors[index]?.[batchIndex],
                    emptyExpireDate,
                    invalidExpireDate, // Thêm lỗi nếu ngày hết hạn không hợp lệ
                },
            },
        }));

        // Cập nhật lại giá trị của productInbounds
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
                        <th className="p-4 text-center font-medium text-black">Mã lô</th>
                        <th className="p-4 text-center font-medium text-black">Số lượng nhập</th>
                        <th className="p-4 text-center font-medium text-black">Đơn giá</th>
                        <th className="p-4 text-center font-medium text-black" hidden={!taxable}>
                            Thuế
                        </th>
                        <th className="p-4 text-center font-medium text-black">Chiết khấu</th>
                        <th className="p-4 text-center font-medium text-black">Hạn sử dụng</th>
                        <th className="p-4 text-center font-medium text-black">Thành tiền</th>
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
                                        <p className="text-black dark:text-white">
                                            {product.productName && bIndex === 0 ? product.productName : ""}
                                        </p>
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center text-black-2">
                                        {product.baseUnit?.unitName && bIndex === 0 ? product.baseUnit?.unitName : ""}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center text-black-2">
                                        {product.requestQuantity && bIndex === 0 ? product.requestQuantity : ""}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="text"
                                            value={batch.batchCode}
                                            disabled={!active}
                                            onChange={(e) => handleChangeBatchCode(e, key, bIndex)}
                                            className="w-[120px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        {/* Hiển thị lỗi nếu có */}
                                        {batchErrors[key]?.[bIndex]?.emptyBatchCode && (
                                            <div className="mt-1 flex items-center gap-1 text-sm text-rose-500">
                                                Không được để trống
                                            </div>
                                        )}
                                        {batchErrors[key]?.[bIndex]?.duplicate && (
                                            <div className="mt-1 flex items-center gap-1 text-sm text-rose-500">
                                                Trùng mã lô
                                            </div>
                                        )}
                                        {batchErrors[key]?.[bIndex]?.lengthExceeded && (
                                            <div className="mt-1 flex items-center gap-1 text-sm text-rose-500">
                                                Tối đa 100 kí tự
                                            </div>
                                        )}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="number"
                                            value={
                                                bIndex === 0
                                                    ? batch.inboundBatchQuantity || product.receiveQuantity
                                                    : batch.inboundBatchQuantity
                                            }
                                            disabled={!active}
                                            onChange={(e) => handleChangeQuantity(e, key, bIndex)}
                                            className="w-[60px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
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
                                            type="string"
                                            value={
                                                bIndex === 0 ? batch.inboundPrice || product.price : batch.inboundPrice
                                            }
                                            disabled={!active}
                                            onChange={(e) => handleChangeInboundPrice(e, key, bIndex)}
                                            className="w-[80px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        {errors.productInbounds?.[key]?.batches?.[bIndex]?.inboundPrice && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.productInbounds?.[key]?.batches?.[bIndex]?.inboundPrice.message}
                                            </span>
                                        )}
                                    </td>

                                    <td
                                        className="border-b border-[#eee] px-4 py-5 text-center text-black-2"
                                        hidden={!taxable}
                                    >
                                        {product.taxRate || "0"}%
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <div style={{ display: "inline-flex", alignItems: "center" }}>
                                            <input
                                                type="number"
                                                value={product.discount}
                                                disabled={!active}
                                                onChange={(e) => handleChangeDiscount(e, key)}
                                                className="w-8 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                            />
                                            <p
                                                className="inline text-meta-5"
                                                style={{ whiteSpace: "nowrap", margin: 0 }}
                                            >
                                                %
                                            </p>
                                        </div>
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <input
                                            type="date"
                                            value={formatDateTimeYYYYMMDD(batch.expireDate)}
                                            disabled={!active}
                                            onChange={(e) => handleChangeExpiredDate(e, key, bIndex)}
                                            className="w-[130px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                        {/* Hiển thị lỗi nếu có */}
                                        {batchErrors[key]?.[bIndex]?.emptyExpireDate && (
                                            <div className="mt-1 flex items-center gap-1 text-sm text-rose-500">
                                                Không được để trống
                                            </div>
                                        )}
                                        {batchErrors[key]?.[bIndex]?.invalidExpireDate && (
                                            <div className="mt-1 flex items-center gap-1 text-sm text-rose-500">
                                                Lô hết hạn
                                            </div>
                                        )}
                                    </td>

                                    <td className="border-b border-[#eee] px-4 py-5 text-center">
                                        <p className="text-emerald-600">
                                            {calculateTotalWithDiscount(batch, product).toLocaleString()}
                                            {"đ "}
                                            {/* Hiển thị thành tiền đã có chiết khấu */}
                                        </p>
                                    </td>

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
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center"></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center" hidden={!taxable}></td>
                        <td className="border-b border-[#eee] px-4 py-5 text-right text-danger">Tổng</td>
                        <td className="border-b border-[#eee] px-4 py-5 text-center text-danger">
                            {totalPricing.toLocaleString()}đ
                        </td>
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

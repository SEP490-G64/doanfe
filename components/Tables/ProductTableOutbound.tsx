"use client";
import React, { useEffect, useRef, useState } from "react";
import { IoTrashBinOutline } from "react-icons/io5";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import IconButton from "../UI/IconButton";
import { formatDateTimeYYYYMMDD } from "@/utils/methods";
import { ProductOutboundType } from "@/lib/schemaValidate/outboundSchema";

interface ProductOutboundError {
    index: number;
    message: string;
    preQuantity: string;
    batches: string;
    outboundQuantity: string;
}

const ProductsTableOutbound = ({
    data,
    active,
    outboundType,
    setProducts,
    errors,
    taxable,
    totalPrice,
    onTotalPriceChange,
    outboundStatus,
}: {
    data: ProductOutboundType[];
    active: boolean;
    outboundType: string | undefined;
    errors: ProductOutboundError[];
    setProducts: any;
    taxable: boolean | undefined;
    totalPrice: any;
    onTotalPriceChange: any;
    outboundStatus: string | undefined;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<number>(-1);
    const [batchErrors, setBatchErrors] = useState<number[]>([]);
    // State lưu lỗi
    const [validationErrors, setValidationErrors] = useState<ProductOutboundError[]>([]);
    const [totalPricing, setTotalPrice] = useState<number>(0);

    const handleChangeTaxRate = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].taxRate = Number(e.target.value);
        setProducts("outboundProductDetails", data);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (data.length > 0) {
                const newData = data.map((product) => {
                    if (product.batch) {
                        const batch =
                            product?.batches?.find((b) => b.batchCode === product.batch.batchCode) ||
                            product?.product?.batches?.find((b) => b.batchCode === product.batch.batchCode);

                        if (batch) {
                            product.batch.id = batch.id;
                            product.batch.batchCode = batch.batchCode;
                            product.batchQuantity = batch.quantity;
                        }
                    }

                    return product;
                });

                setProducts("outboundProductDetails", newData);
            }
        }, 500); // Delay 500ms để đảm bảo dữ liệu được tải xong

        return () => clearTimeout(timer); // Dọn dẹp timer khi component unmount
    }, [data, setProducts]);

    useEffect(() => {
        const total = calculateTotalPrice(data); // Tính tổng tiền khi `data` thay đổi
        setTotalPrice(total); // Cập nhật state
        onTotalPriceChange(total); // Gửi tổng tiền về parent component
    }, [data, onTotalPriceChange]);

    const calculateTotalPrice = (products: ProductOutboundType[]) => {
        return products.reduce((total, product, productIndex) => {
            // Kiểm tra lỗi số lượng xuất cho sản phẩm
            const validationError = validationErrors.some((error) => error.index === productIndex);
            if (validationError) {
                return total; // Bỏ qua sản phẩm có lỗi
            }

            // Kiểm tra nếu là bán hàng, ưu tiên sellPrice
            let price;
            if (outboundType === "BAN_HANG") {
                // Ưu tiên sellPrice khi là bán hàng
                price = product.sellPrice || product.price || 0;
            } else {
                // Nếu không phải bán hàng, kiểm tra cả batches và product.batches
                const batches = product.batches || [];
                const productBatches = product.product?.batches || [];

                // Nếu cả batches và product.batches đều rỗng, dùng inboundPrice
                price =
                    batches.length === 0 && productBatches.length === 0
                        ? product.inboundPrice || 0 // Nếu cả batches và product.batches đều rỗng thì dùng inboundPrice
                        : product.price || product.sellPrice || 0; // Nếu có batches, tính theo price hoặc sellPrice
            }

            const quantity = product.outboundQuantity || 0; // Số lượng xuất (mặc định là 0 nếu không có)
            const taxRate = taxable ? product.taxRate || 0 : 0; // Tỷ lệ thuế (%)

            // Tính tổng tiền sản phẩm
            const subtotal = quantity * price; // Tổng tiền trước thuế
            const taxAmount = subtotal * (taxRate / 100); // Tiền thuế
            const totalProductPrice = subtotal + taxAmount; // Tổng tiền sau thuế

            return total + totalProductPrice; // Cộng tiền sản phẩm vào tổng tiền
        }, 0); // Giá trị khởi tạo của tổng tiền là 0
    };

    // Tính toán tổng tiền của một batch sau chiết khấu và thuế
    const calculateTotalWithDiscount = (product: any) => {
        // Kiểm tra nếu là bán hàng, ưu tiên sellPrice
        let price;
        if (outboundType === "BAN_HANG") {
            // Nếu không phải bán hàng, kiểm tra cả batches và product.batches
            const batches = product.batches || [];
            const productBatches = product.product?.batches || [];

            // Nếu cả batches và product.batches đều rỗng, dùng inboundPrice
            price =
                batches.length === 0 && productBatches.length === 0
                    ? product.sellPrice || product.inboundPrice || 0
                    : product.sellPrice || product.price || 0; // Ưu tiên sellPrice khi là bán hàng
        } else {
            // Nếu không phải bán hàng, kiểm tra cả batches và product.batches
            const batches = product.batches || [];
            const productBatches = product.product?.batches || [];

            // Nếu cả batches và product.batches đều rỗng, dùng inboundPrice
            price =
                batches.length === 0 && productBatches.length === 0
                    ? product.inboundPrice || 0 // Nếu cả batches và product.batches rỗng thì dùng inboundPrice
                    : product.price || product.sellPrice || 0; // Nếu có batches, tính theo price hoặc sellPrice
        }

        const quantity = product.outboundQuantity || 0;
        const taxRate = taxable ? product.taxRate || 0 : 0; // Tỷ lệ thuế (%)

        const total = quantity * price; // Tổng tiền ban đầu (chưa thuế)
        const taxAmount = total * (taxRate / 100); // Số tiền thuế

        return total + taxAmount; // Tổng tiền sau thuế
    };

    const removeItem = (index: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex(index);
        onOpen();
    };

    const handleDelete = () => {
        data.splice(removedItemIndex, 1);
        setProducts("outboundProductDetails", data);
    };

    const handleChangeBatchCode = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const selectedBatchCode = e.target.value;
        const product = data[index];

        // Xóa các lỗi cũ cho dòng hiện tại
        setBatchErrors((prevErrors) => prevErrors.filter((i) => i !== index));

        // Kiểm tra nếu có batch mà chưa chọn mã lô
        let duplicate = false;
        if (selectedBatchCode) {
            data.forEach((d, dindex) => {
                if (d.batch?.batchCode === selectedBatchCode && dindex !== index) {
                    duplicate = true;
                }
            });
        }

        if (duplicate) {
            // Thêm lỗi trùng mã lô
            setBatchErrors((prevErrors) => [...prevErrors, index]);
        }

        // Cập nhật batch thông tin khi chọn mã lô hợp lệ
        if (selectedBatchCode) {
            let batch = product?.batches?.find((b) => b.batchCode === selectedBatchCode);
            if (!batch) {
                batch = product?.product?.batches?.find((b) => b.batchCode === selectedBatchCode);
            }

            if (batch) {
                // Cập nhật thông tin batch
                product.batch.id = batch.id;
                product.batch.batchCode = batch.batchCode;
                product.batch.expireDate = batch.expireDate;
                product.price = batch.inboundPrice;
                product.batchQuantity = batch.quantity;
            }
        }

        // Cập nhật lại dữ liệu sản phẩm
        setProducts("outboundProductDetails", data);
    };

    const handleChangeUnit = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const selectedUnitId = Number(e.target.value); // Lấy ID của unit được chọn từ dropdown
        const product = data[index]; // Lấy sản phẩm tại index

        if (selectedUnitId) {
            // Tìm unit tương ứng trong danh sách productUnits
            const selectedUnit = product?.productUnits?.find((unit) => unit.id === selectedUnitId);

            if (selectedUnit) {
                // Cập nhật targetUnit và batchQuantity
                product.targetUnit = { id: selectedUnit.id, unitName: selectedUnit.unitName };
                product.batchQuantity = selectedUnit.productUnitQuantity; // Gán productUnitQuantity vào batchQuantity
            }
        }

        // Cập nhật lại dữ liệu
        setProducts("outboundProductDetails", [...data]);
    };

    const handlePreQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (outboundStatus !== "KIEM_HANG") {
            const newQuantity = e.target.value.replace(/,/g, ""); // Lấy giá trị nhập từ input
            const parsedQuantity = newQuantity === "" ? null : Number(newQuantity); // Chuyển giá trị thành số hoặc null nếu rỗng

            const updatedData = [...data];
            updatedData[index].preQuantity = parsedQuantity || 0; // Gán giá trị mới (mặc định 0 nếu null)

            const currentBatchQuantity = updatedData[index]?.batchQuantity || 0;
            const currentProductQuantity = updatedData[index]?.productQuantity || 0;

            const hasBatches =
                updatedData[index]?.batches?.length > 0 || updatedData[index]?.product?.batches?.length > 0;

            // Danh sách lỗi mới
            const newErrors = [];
            // Kiểm tra nếu số lượng xuất vượt quá tồn kho
            if (!hasBatches && parsedQuantity > currentProductQuantity) {
                newErrors.push({ index, message: "Số lượng xuất phải <= số lượng tồn kho sản phẩm." });
            }

            // Cập nhật danh sách lỗi
            setValidationErrors((prevErrors) => {
                // Xóa lỗi cũ tại index này và thêm lỗi mới (nếu có)
                const filteredErrors = prevErrors.filter((error) => error.index !== index);
                return [...filteredErrors, ...newErrors];
            });

            // Cập nhật lại sản phẩm
            setProducts("outboundProductDetails", updatedData);
        } else {
            return;
        }
    };

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (outboundStatus === "KIEM_HANG" || outboundType === "BAN_HANG") {
            const newQuantity = e.target.value.replace(/,/g, ""); // Lấy giá trị nhập từ input
            const parsedQuantity = newQuantity === "" ? null : Number(newQuantity); // Chuyển giá trị thành số hoặc null nếu rỗng

            const updatedData = [...data];
            updatedData[index].outboundQuantity = parsedQuantity || 0; // Gán giá trị mới (mặc định 0 nếu null)

            const currentBatchQuantity = updatedData[index]?.batchQuantity || 0;
            const currentProductQuantity = updatedData[index]?.productQuantity || 0;

            const hasBatches =
                updatedData[index]?.batches?.length > 0 || updatedData[index]?.product?.batches?.length > 0;

            const newErrors = [];

            // Kiểm tra nếu số lượng xuất vượt quá tồn kho
            if (hasBatches && parsedQuantity > currentBatchQuantity) {
                newErrors.push({ index, message: "Số lượng xuất phải <= số lượng tồn kho trong lô." });
            } else if (!hasBatches && parsedQuantity > currentProductQuantity) {
                newErrors.push({ index, message: "Số lượng xuất phải <= số lượng tồn kho sản phẩm." });
            }

            // Cập nhật danh sách lỗi
            setValidationErrors((prevErrors) => {
                const filteredErrors = prevErrors.filter((error) => error.index !== index); // Xóa lỗi cũ cùng index
                return [...filteredErrors, ...newErrors];
            });

            // Cập nhật lại sản phẩm
            setProducts("outboundProductDetails", updatedData);
        } else {
            return;
        }
    };

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
                        {(outboundType !== "BAN_HANG" || ["HOAN_THANH"].includes(outboundStatus as string)) && (
                            <th className="p-4 text-center font-medium text-black">Mã lô</th>
                        )}
                        {outboundType === "BAN_HANG" && (
                            <th className="p-4 text-center font-medium text-black">Đơn vị xuất</th>
                        )}
                        <th
                            className="p-4 text-center font-medium text-black"
                            hidden={["CHO_DUYET", "HOAN_THANH"].includes(outboundStatus as string)}
                        >
                            Số lượng tồn kho
                        </th>
                        <th className="p-4 text-center font-medium text-black" hidden={outboundType === "BAN_HANG"}>
                            Số lượng dự kiến xuất
                        </th>
                        <th
                            className="p-4 text-center font-medium text-black"
                            hidden={
                                !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(outboundStatus as string) ||
                                outboundType === "BAN_HANG"
                            }
                        >
                            Số lượng thực tế
                        </th>
                        <th className="p-4 text-center font-medium text-black" hidden={outboundType !== "BAN_HANG"}>
                            Số lượng bán
                        </th>
                        <th className="p-4 text-center font-medium text-black">Đơn giá</th>
                        <th className="p-4 text-center font-medium text-black" hidden={!taxable}>
                            Thuế
                        </th>
                        {outboundType !== "BAN_HANG" && (
                            <th className="p-4 text-center font-medium text-black">Hạn sử dụng</th>
                        )}
                        <th
                            className="p-4 text-center font-medium text-black"
                            hidden={!["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(outboundStatus as string)}
                        >
                            Thành tiền
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((product, key) => (
                        <tr key={key} className="text-left">
                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <p className="text-meta-5">{key + 1}</p>
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-left">
                                <p className="text-black dark:text-white">{product?.product?.productName}</p>
                            </td>

                            {outboundType !== "BAN_HANG" && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center text-black-2">
                                    {product?.productBaseUnit?.unitName ? product?.productBaseUnit.unitName : ""}
                                </td>
                            )}

                            {outboundType !== "BAN_HANG" && (product?.batches || product?.product?.batches) && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center text-black-2">
                                    {product?.batches?.length > 0 || product?.product?.batches?.length > 0 ? (
                                        <>
                                            <select
                                                disabled={!active || outboundStatus === "KIEM_HANG"}
                                                value={product?.batch?.batchCode || ""}
                                                onChange={(e) => handleChangeBatchCode(e, key)}
                                                className="w-full min-w-[120px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition"
                                            >
                                                <option value="" className="text-black dark:text-white">
                                                    Chọn lô
                                                </option>
                                                {(product?.batches || []).map((batch) => (
                                                    <option
                                                        key={batch.id}
                                                        value={batch.batchCode}
                                                        className="text-black dark:text-white"
                                                    >
                                                        {batch.batchCode}
                                                    </option>
                                                ))}
                                                {(product?.product?.batches || []).map((batch) => (
                                                    <option
                                                        key={batch.id}
                                                        value={batch.batchCode}
                                                        className="text-black dark:text-white"
                                                    >
                                                        {batch.batchCode}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[key]?.batches && (
                                                <p className="mt-1 text-xs text-danger">{errors[key]?.batches}</p>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-gray-500">Sản phẩm không có lô</span>
                                    )}
                                    {batchErrors.includes(key) && product?.batch?.batchCode && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">Trùng mã lô</span>
                                    )}
                                </td>
                            )}

                            {((outboundType !== "BAN_HANG" && !(product?.batches || product?.product?.batches)) ||
                                (outboundType === "BAN_HANG" && ["HOAN_THANH"].includes(outboundStatus as string))) && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="text"
                                        value={product?.batch?.batchCode}
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
                                        className={`w-[120px] min-w-[50px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition`}
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

                            {outboundType === "BAN_HANG" && !product?.productUnits && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="text"
                                        value={product?.targetUnit?.unitName}
                                        disabled
                                        className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            <td
                                className="border-b border-[#eee] px-4 py-5 text-center"
                                hidden={["CHO_DUYET", "HOAN_THANH"].includes(outboundStatus as string)}
                            >
                                {product?.batches?.length === 0 || product?.product?.batches?.length === 0 ? (
                                    // Hiển thị productQuantity khi không có batches
                                    <input
                                        type="text"
                                        value={product?.productQuantity?.toLocaleString() || 0}
                                        disabled
                                        className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                ) : (
                                    // Hiển thị batchQuantity nếu có, nếu không thì 0
                                    <input
                                        type="text"
                                        value={product?.batchQuantity?.toLocaleString() || 0}
                                        disabled
                                        className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                )}
                            </td>

                            <td
                                className="border-b border-[#eee] px-4 py-5 text-center"
                                hidden={outboundType === "BAN_HANG"}
                            >
                                <input
                                    type="text"
                                    value={product?.preQuantity?.toLocaleString() || ""}
                                    disabled={
                                        !active ||
                                        outboundStatus === "KIEM_HANG" ||
                                        ((product?.batches?.length > 0 || product?.product?.batches?.length > 0) &&
                                            !product?.batch?.id)
                                    }
                                    onChange={(e) => handlePreQuantity(e, key)}
                                    className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                                {(outboundStatus as string) !== "KIEM_HANG" &&
                                    validationErrors.find((error) => error.index === key) && (
                                        <span className="mt-1 block w-full text-sm text-rose-500">
                                            {validationErrors.find((error) => error.index === key)?.message}
                                        </span>
                                    )}
                                {errors[key]?.preQuantity && (
                                    <p className="mt-1 text-xs text-danger">{errors[key]?.preQuantity.message}</p>
                                )}
                            </td>

                            <td
                                className="border-b border-[#eee] px-4 py-5 text-center"
                                hidden={
                                    !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(
                                        outboundStatus as string
                                    ) && outboundType !== "BAN_HANG"
                                }
                            >
                                <input
                                    type="text"
                                    value={product?.outboundQuantity?.toLocaleString() || "0"}
                                    disabled={!active || (outboundType == "BAN_HANG" && !product?.targetUnit?.id)}
                                    onChange={(e) => handleChangeQuantity(e, key)}
                                    className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                                {validationErrors.find((error) => error.index === key) && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {validationErrors.find((error) => error.index === key)?.message}
                                    </span>
                                )}
                                {errors[key]?.outboundQuantity && (
                                    <p className="mt-1 text-xs text-danger">{errors[key]?.outboundQuantity.message}</p>
                                )}
                            </td>

                            {outboundType !== "BAN_HANG" ? (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    {product?.batches?.length === 0 || product?.product?.batches?.length === 0 ? (
                                        // Hiển thị productQuantity khi không có batches
                                        <input
                                            type="text"
                                            value={product?.inboundPrice ? product?.inboundPrice?.toLocaleString() : "0"}
                                            disabled
                                            className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    ) : (
                                        // Hiển thị batchQuantity nếu có, nếu không thì 0
                                        <input
                                            type="text"
                                            value={product?.price? product?.price?.toLocaleString() : "0"}
                                            disabled
                                            className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                        />
                                    )}
                                </td>
                            ) : (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="text"
                                        defaultValue={product?.sellPrice ? product?.sellPrice?.toLocaleString() :
                                            (product?.price ? product?.price?.toLocaleString() : "0")}
                                        disabled
                                        className="w-[100px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            <td className="border-b border-[#eee] px-4 py-5 text-center" hidden={!taxable}>
                                <div className="flex items-center justify-center gap-1">
                                    <input
                                        type="text"
                                        defaultValue={taxable ? product.taxRate || "0" : "0"}
                                        onChange={(e) => handleChangeTaxRate(e, key)}
                                        disabled={!active}
                                        className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                    <span className="text-meta-5">%</span>
                                </div>
                            </td>

                            {outboundType !== "BAN_HANG" && (
                                <td className="border-b border-[#eee] px-4 py-5 text-center">
                                    <input
                                        type="date"
                                        value={formatDateTimeYYYYMMDD(product?.batch?.expireDate)}
                                        disabled
                                        className="w-[125px] rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                </td>
                            )}

                            <td
                                className="border-b border-[#eee] px-4 py-5 text-center"
                                hidden={
                                    !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(
                                        outboundStatus as string
                                    ) && outboundType !== "BAN_HANG"
                                }
                            >
                                <p className="text-emerald-600">
                                    {calculateTotalWithDiscount(product).toLocaleString()}
                                    {"đ "}
                                </p>
                            </td>

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
                    ))}
                    <tr>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={["HOAN_THANH"].includes(outboundStatus as string) && outboundType != "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={["HOAN_THANH"].includes(outboundStatus as string) && outboundType != "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={outboundType === "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={outboundType === "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={outboundType === "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={outboundType === "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={outboundStatus === "KIEM_HANG" && outboundType !== "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={
                                !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(outboundStatus as string) &&
                                outboundType !== "BAN_HANG"
                            }
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={!taxable || outboundType === "BAN_HANG"}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center"
                            hidden={["CHO_DUYET"].includes(outboundStatus as string)}
                        ></td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-right text-danger"
                            hidden={
                                !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(outboundStatus as string) &&
                                outboundType !== "BAN_HANG"
                            }
                        >
                            Tổng
                        </td>
                        <td
                            className="border-b border-[#eee] px-4 py-5 text-center text-danger"
                            hidden={
                                !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(outboundStatus as string) &&
                                outboundType !== "BAN_HANG"
                            }
                        >
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

export default ProductsTableOutbound;

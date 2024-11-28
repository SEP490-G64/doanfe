import { IoTrashBinOutline } from "react-icons/io5";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";

import IconButton from "../UI/IconButton";
import React, { useState, useEffect } from "react";
import { ProductInboundType } from "@/lib/schemaValidate/inboundSchema";
import { FieldError } from "react-hook-form";
import { toast } from "react-toastify";

interface ProductInboundError {
    requestQuantity?: FieldError; // Định nghĩa lỗi riêng cho requestQuantity
    isDuplicate?: boolean; // Lỗi trùng lặp
}

const ProductsTableBeforeCheck = ({
    data,
    active,
    setProducts,
    errors,
    taxable,
}: {
    data: ProductInboundType[];
    active: boolean;
    setProducts: any;
    errors: ProductInboundError[];
    taxable: boolean | undefined;
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [removedItemIndex, setRemovedItemIndex] = useState<number>(-1);

    // State lưu lỗi
    const [validationErrors, setValidationErrors] = useState<ProductInboundError[]>([]);

    // Kiểm tra sản phẩm trùng lặp
    const isDuplicate = (product: ProductInboundType, index: number) => {
        const currentCode = product.productName?.trim().toLowerCase(); // Chuẩn hóa mã sản phẩm
        return data.some((item, idx) => {
            const comparisonCode = item.productName?.trim().toLowerCase();
            return idx !== index && comparisonCode === currentCode;
        });
    };

    // Validate trùng lặp và xóa sản phẩm bị trùng
    const validateDuplicatesAndRemove = () => {
        const duplicateErrors = data.map((product, index) => ({
            ...errors[index],
            isDuplicate: isDuplicate(product, index), // Gắn lỗi nếu sản phẩm trùng
        }));

        setValidationErrors(duplicateErrors); // Cập nhật toàn bộ lỗi mới

        // Lặp qua tất cả các sản phẩm từ cuối lên đầu và xóa sản phẩm trùng
        for (let index = data.length - 1; index >= 0; index--) {
            const product = data[index];
            if (duplicateErrors[index]?.isDuplicate) {
                toast.error(`Sản phẩm ${product.productName} bị trùng!`);
                data.splice(index, 1); // Xóa sản phẩm bị trùng
                setProducts("productInbounds", data); // Cập nhật lại danh sách sản phẩm
                return;
            }
        }
    };

    // Xử lý khi xóa sản phẩm
    const removeItem = (index: number, e?: React.MouseEvent) => {
        e!.preventDefault();
        setRemovedItemIndex(index);
        onOpen();
    };

    const handleDelete = () => {
        data.splice(removedItemIndex, 1); // Xóa sản phẩm trong mảng data
        setProducts("productInbounds", data); // Cập nhật dữ liệu
        setValidationErrors((prevErrors) => prevErrors.filter((_, idx) => idx !== removedItemIndex)); // Xóa lỗi tương ứng
    };

    // Xử lý khi thay đổi số lượng
    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].requestQuantity = Number(e.target.value.replace(/,/g, ""));
        setProducts("productInbounds", data);
    };

    // Lấy giá trị đơn vị chuẩn hóa
    const normalizeUnit = (product: ProductInboundType) => {
        return product.productBaseUnit?.unitName || product.baseUnit?.unitName || ""; // Ưu tiên productBaseUnit, sau đó là baseUnit
    };

    // Xử lý khi thay đổi đơn vị
    const handleChangeBaseUnit = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index]!.productBaseUnit!.unitName = e.target.value;
        setProducts("productInbounds", data);
    };

    // Xử lý khi thay đổi số lượng
    const handleChangeTaxRate = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        data![index].taxRate = Number(e.target.value);
        setProducts("productInbounds", data);
    };

    // Validate mỗi khi data thay đổi
    useEffect(() => {
        validateDuplicatesAndRemove(); // Gọi validateDuplicatesAndRemove để kiểm tra trùng lặp và xóa sản phẩm
    }, [data]);

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
            <table className="w-full table-auto">
                <thead className="rounded-sm bg-gray-2 text-left">
                    <tr>
                        <th className="p-4 text-center font-medium text-black">STT</th>
                        <th className="p-4 text-center font-medium text-black">Tên sản phẩm</th>
                        <th className="p-4 text-center font-medium text-black">Đơn vị</th>
                        <th className="p-4 text-center font-medium text-black" hidden={!taxable}>
                            Thuế
                        </th>
                        <th className="p-4 text-center font-medium text-black">Số lượng</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((product, key) => (
                        <tr key={key} className="text-left">
                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <p className="text-meta-5">{key + 1}</p>
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-left">
                                <p className="text-black dark:text-white">{product.productName}</p>
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="text"
                                    defaultValue={normalizeUnit(product)} // Lấy giá trị từ hàm normalizeUnit
                                    onChange={(e) => handleChangeBaseUnit(e, key)}
                                    disabled
                                    className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                />
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center" hidden={!taxable}>
                                <div className="flex items-center justify-center gap-1">
                                    <input
                                        type="text"
                                        defaultValue={taxable ? product.taxRate || "0" : "0"}
                                        onChange={(e) => handleChangeTaxRate(e, key)}
                                        disabled
                                        className="w-12 rounded border-1.5 border-stroke bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter"
                                    />
                                    <span className="text-meta-5">%</span>
                                </div>
                            </td>

                            <td className="border-b border-[#eee] px-4 py-5 text-center">
                                <input
                                    type="text"
                                    value={product.requestQuantity?.toLocaleString() || ""}
                                    disabled={!active}
                                    onChange={(e) => handleChangeQuantity(e, key)}
                                    className={`w-24 rounded border-1.5 ${
                                        errors[key]?.requestQuantity ? "border-danger" : "border-stroke"
                                    } bg-transparent p-1 text-center text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter`}
                                />
                                {/* Hiển thị lỗi */}
                                {errors[key]?.requestQuantity && (
                                    <p className="mt-1 text-xs text-danger">{errors[key]?.requestQuantity.message}</p>
                                )}
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
                </tbody>
            </table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                            <ModalBody>
                                <p>Bạn có chắc muốn xóa sản phẩm này không?</p>
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

export default ProductsTableBeforeCheck;

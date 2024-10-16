"use client";
import React, { useState } from "react";
import SwitcherThree from "@/components/Switchers/SwitcherThree";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { BsLifePreserver } from "react-icons/bs";

import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import UploadImage from "@/components/UI/UploadImage";
import Loader from "@/components/common/Loader";
import { useAppContext } from "@/components/AppProvider/AppProvider";

const ProductForm = ({ viewMode, productId }: { viewMode: "details" | "update" | "create"; productId?: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();
    const optsData = [
        {
            value: "NHIET_DO",
            label: "Nhiệt độ",
        },
        {
            value: "DO_AM",
            label: "Độ ẩm",
        },
        {
            value: "ANH_SANG",
            label: "Ánh sáng",
        },
        {
            value: "KHONG_KHI",
            label: "Không khí",
        },
        {
            value: "KHAC",
            label: "Khác",
        },
    ];

    const handleOnClick = (e: React.MouseEvent) => {
        e.preventDefault();
        toast.success("Ok roi!");
    };

    if (loading) return <Loader />;
    else
        return (
            <>
                <form>
                    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">
                            {/* <!-- Input Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Thông tin sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tên sản phẩm <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Nhập tên sản phẩm"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Mã sản phẩm <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập mã sản phẩm"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Số đăng ký
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập số đăng ký"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Đơn vị <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập đơn vị"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Hoạt chất
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập hoạt chất"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tá dược
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập tá dược"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Quy cách đóng gói
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập quy cách đóng gói"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Toggle switch input --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Giá sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Giá nhập
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập giá nhập"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Giá bán <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập giá bán"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Điều kiện đặc biệt</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Kiểu điều kiện
                                            </label>
                                            <SelectGroupTwo
                                                icon={<BsLifePreserver />}
                                                placeholder="Chọn điều kiện"
                                                data={optsData}
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Hướng dẫn xử lý (Nếu cần)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập hướng dẫn xử lý"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Đơn vị quy đổi</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Đơn vị <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập đơn vị"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Số lượng <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập số lượng"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-9">
                            {/* <!-- File upload --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Ảnh sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <UploadImage sessionToken={sessionToken} />
                                </div>
                            </div>
                            {/* <!-- Textarea Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Phân loại sản phẩm</h3>
                                </div>
                                <div className="flex flex-col gap-5.5 p-6.5">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc nhóm sản phâm
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập nhóm sản phẩm"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc loại sản phẩm
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập loại sản phẩm"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc nhà sản xuất
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập nhà sản xuất"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Checkbox and radio --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Tình trạng thuốc</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tình trạng
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Còn hàng"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Có thể bán
                                            </label>
                                            {/* <SwitcherThree /> */}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tồn kho
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="200"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tồn chi nhánh
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="25"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Select input --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Vị trí trong kho</h3>
                                </div>

                                <div className="p-6.5">
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Chi nhánh
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Chi nhánh số 2"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Vị trí
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập vị trí"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Số lượng tối thiểu
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập số lượng tối thiểu"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Số lượng tối đa
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập số lượng tối đa"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            {viewMode !== "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-primary bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                >
                                    {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                                </button>
                            )}
                            {viewMode === "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-primary bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type={"button"}
                                    onClick={() => router.push(`/products/update/${productId}`)}
                                >
                                    Đi đến cập nhật
                                </button>
                            )}
                        </div>
                        <div className="w-full xl:w-1/2">
                            {viewMode !== "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-stroke/90"
                                    type={"button"}
                                    onClick={() => onOpenChange()}
                                >
                                    Hủy
                                </button>
                            )}
                            {viewMode === "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-stroke/90"
                                    type={"button"}
                                    onClick={() => router.push(`/products/list`)}
                                >
                                    Quay lại danh sách
                                </button>
                            )}
                        </div>
                    </div>

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                    <ModalBody>
                                        <p>Bạn có chắc muốn hủy thực hiện hành động này không?</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="default" variant="light" onPress={onClose}>
                                            Không
                                        </Button>
                                        <Button
                                            color="primary"
                                            onPress={() => {
                                                router.push(`/products/list`);
                                                onClose();
                                            }}
                                        >
                                            Chắc chắn
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </form>
            </>
        );
};

export default ProductForm;

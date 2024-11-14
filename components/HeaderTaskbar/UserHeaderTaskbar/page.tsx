import React, { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { FaFileImport } from "react-icons/fa6";

import Button from "@/components/UI/Button";
import { DataSearch } from "@/types/product";
import { useRouter } from "next/navigation";
import SelectGroupOne from "@/components/SelectGroup/SelectGroupOne";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure, Button as NextUIButton } from "@nextui-org/react";
import { toast } from "react-toastify";
import { exportUser, importUser } from "@/services/userServices";
import { FaFileExport } from "react-icons/fa";

function UserHeaderTaskbar({
                               sessionToken,
                               buttons,
                               dataSearch,
                               setDataSearch,
                               handleSearch
                           }: {
    sessionToken: string;
    buttons?: string;
    dataSearch?: DataSearch;
    setDataSearch?: any;
    handleSearch?: any;
}) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const statusOpts = [
        { value: "ACTIVATE", label: "Đang kích hoạt" },
        { value: "DEACTIVATE", label: "Vô hiệu hóa" },
        { value: "REJECTED", label: "Từ chối" },
    ];

    const handleOpenModal = () => {
        onOpen();
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = async () => {
        if (selectedFile) {
            toast.warning("Hệ thống đang xử lý nhập dữ liệu, vui lòng đợi trong giây lát");
            if (loading) {
                toast.warning("Hệ thống đang xử lý dữ liệu");
                return;
            }
            setLoading(true);

            // Tạo FormData chứa file
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await importUser(formData, sessionToken);

                // Xử lý phản hồi từ server
                if (response) {
                    toast.success("Nhập thành công");
                }

                handleSearch();
            } catch (error) {
                toast.error("Nhập thất bại");
            } finally {
                setLoading(false);
            }
        } else {
            toast.error("Vui lòng chọn file");
        }
    };

    const handleExport = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);

        try {
            const res = await exportUser(sessionToken);

            // Kiểm tra xem res.data có phải là Blob không
            if (res && res instanceof Blob) {
                // Tạo URL tạm thời từ Blob trả về
                const url = window.URL.createObjectURL(res); // res là Blob

                // Tạo một thẻ <a> để tải tệp
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'user.xlsx'); // Đặt tên tệp tải về
                document.body.appendChild(link);
                link.click(); // Bắt đầu tải xuống

                // Giải phóng URL tạm thời
                window.URL.revokeObjectURL(url);

                toast.success("Xuất danh sách người dùng thành công");
            } else {
                toast.error("Dữ liệu không hợp lệ");
            }
        } catch (error) {
            toast.error("Xuất file thất bại");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Nhóm ô tìm kiếm và Select */}
            <div className="flex flex-1 items-center gap-2">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1">
                    <button
                        className="absolute left-0 top-0 flex h-full items-center justify-center rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                        onClick={handleSearch}
                    >
                        <svg
                            className="fill-white hover:fill-yellow-400"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    <input
                        type="text"
                        value={dataSearch?.keyword}
                        placeholder="Nhập để tìm kiếm..."
                        onChange={(e) => setDataSearch({ ...dataSearch, keyword: e.target.value })}
                        className="w-full bg-white py-2 pl-12 pr-4 font-medium focus:outline-none"
                    />
                </div>

                {/* Select trạng thái */}
                <div className="max-w-xs flex-shrink-0">
                    <SelectGroupOne
                        placeHolder={"Chọn trạng thái"}
                        optsData={statusOpts}
                        dataSearch={dataSearch}
                        setDataSearch={setDataSearch}
                        dataKey="status"
                    />
                </div>
            </div>

            {/* Các nút thao tác */}
            <div className="mt-2 flex gap-2 sm:mt-0">
                <Button
                    label="Nhập file"
                    size="small"
                    icon={<FaFileImport />}
                    type="success"
                    onClick={() => {
                        handleOpenModal();
                    }}
                />
                <Button
                    label="Xuất file"
                    size="small"
                    icon={<FaFileExport />}
                    type="outline"
                    onClick={() => {
                        handleExport();
                    }}
                />
                <Button label="Thêm mới" size="small" icon={<FaPlus />} onClick={() => router.push("/users/create")} />
            </div>

            <Modal isOpen={isOpen} onOpenChange={(isOpen) => { onOpenChange(isOpen); if (!isOpen) setSelectedFile(null); }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Nhập Danh sách Người dùng</ModalHeader>
                            <ModalBody>
                                {/* Hướng dẫn tải mẫu và upload */}
                                <div className="mb-4 border-b pb-2">
                                    <h3 className="text-gray-600 mb-2 text-lg font-semibold">Hướng dẫn</h3>
                                    <p className="text-gray-700">
                                        Vui lòng tải file mẫu, đọc kĩ hướng dẫn trong sheet 2, điền đầy đủ thông tin,
                                        và tải lên lại file để nhập dữ liệu.
                                    </p>
                                    <a
                                        href="https://hrm-be-bucket.sgp1.digitaloceanspaces.com/documents/UserTemplate.xlsx"
                                        download
                                        className="mt-3 inline-flex items-center font-medium text-blue-500 hover:text-blue-700"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mr-1 h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 17V3m0 0l8 8-8-8-8 8m13 7v4h-10v-4"></path>
                                        </svg>
                                        Tải file mẫu
                                    </a>
                                </div>

                                {/* Chọn file từ máy */}
                                <div>
                                    <label className="text-gray-700 mb-2 block font-medium">
                                        Tải lên file người dùng
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileSelect}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="border-gray-300 hover:bg-gray-50 flex cursor-pointer items-center rounded-md border bg-white px-4 py-2 shadow-sm"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="mr-2 h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M7 16V4m0 0l8 8-8 8m13-8a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Chọn file
                                        </label>
                                    </div>
                                    {selectedFile && (
                                        <p className="mt-2 text-sm text-gray-500">Đã chọn: {selectedFile.name}</p>
                                    )}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <NextUIButton color="default" onPress={onClose}>
                                    Hủy
                                </NextUIButton>
                                <NextUIButton color="primary" onPress={() => {
                                    handleFileUpload();
                                    onClose();
                                }}>
                                    Nhập file
                            </NextUIButton>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default UserHeaderTaskbar;

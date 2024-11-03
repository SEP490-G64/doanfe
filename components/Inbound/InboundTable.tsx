"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Tooltip,
    Modal,
    ModalContent,
    useDisclosure,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select,
    SelectItem,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { FaPencil } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/components/AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import { Inbound } from "@/types/inbound";
import { getListInbound } from "@/services/inboundServices";
import { inboundColumns } from "@/utils/data";
import { formatDateTime } from "@/utils/methods";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";

const InboundTable = () => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [inboundData, setInboundData] = useState<Inbound[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { sessionToken } = useAppContext();

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const getListInboundByPage = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getListInbound(page - 1, rowsPerPage, sessionToken);

            if (response.message === "200 OK") {
                setInboundData(
                    response.data.map((item: Inbound, index: number) => ({
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

    const handleOpenModal = (branchId: string) => {
        setSelectedId(branchId);
        onOpen();
    };

    useEffect(() => {
        getListInboundByPage();
    }, [page, rowsPerPage]);

    const renderInboundStatus = useCallback((status: string) => {
        switch (status) {
            case "CHUA_LUU":
                return (
                    <p className={"inline-flex rounded-full bg-danger/10 px-3 py-1 text-sm font-medium text-danger"}>
                        Khởi tạo
                    </p>
                );
            case "BAN_NHAP":
                return (
                    <p className={"inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Bản nháp
                    </p>
                );
            case "CHO_DUYET":
                return (
                    <p className={"inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"}>
                        Chờ duyệt
                    </p>
                );
            case "CHO_HANG":
                return (
                    <p className={"inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Chờ hàng
                    </p>
                );
            case "KIEM_HANG":
                return (
                    <p className={"inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Kiểm hàng
                    </p>
                );
            case "DANG_THANH_TOAN":
                return (
                    <p className={"inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Đang thanh toán
                    </p>
                );
            case "HOAN_THANH":
                return (
                    <p className={"inline-flex rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success"}>
                        Hoàn thành
                    </p>
                );
        }
    }, []);

    const renderCell = useCallback((inbound: Inbound, columnKey: React.Key) => {
        const cellValue =
            inbound[
                columnKey as "id" | "inboundCode" | "inboundType" | "inboundBatchDetails" | "inboundDetails" | "status"
            ];

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{inbound.index}</h5>;
            case "inboundCode":
                return <h5 className="font-normal text-black dark:text-white">{inbound.inboundCode}</h5>;
            case "supplierName":
                return <p className="font-normal text-black dark:text-white">{inbound.supplier?.supplierName}</p>;
            case "createdBy":
                return (
                    <p className="font-normal text-black dark:text-white">{`${inbound.createdBy.firstName} ${inbound.createdBy.lastName}`}</p>
                );
            case "status":
                return renderInboundStatus(inbound.status);
            case "createdDate":
                return <p className="font-normal text-black dark:text-white">{formatDateTime(inbound.createdDate)}</p>;
            case "actions":
                return (
                    <div className="flex items-center justify-center space-x-3.5">
                        <Tooltip content="Chi tiết">
                            <button
                                className="hover:text-primary"
                                onClick={() => router.push(`/inbound/details/${inbound.id}`)}
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
                                onClick={() => router.push(`/inbound/update/${inbound.id}`)}
                            >
                                <FaPencil />
                            </button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    if (loading) return <Loader />;
    else {
        if (!userInfo?.roles?.some(role => role.type === 'MANAGER' || role.type === 'STAFF')) {
            return (
                <Unauthorized></Unauthorized>
            );
        }
        return (
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                Tìm thấy <span className="font-bold text-blue-600">{total}</span> đơn nhập hàng
                <div className="max-w-full overflow-x-auto">
                    <Table
                        bottomContent={
                            totalPages > 0 ? (
                                <div className="flex w-full justify-between">
                                    <Select
                                        label="Số bản ghi / trang"
                                        selectedKeys={[rowsPerPage.toString()]}
                                        onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
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
                        <TableHeader>
                            <TableHeader columns={inboundColumns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.uid}
                                        className="py-4 text-sm font-medium text-black"
                                        align="center"
                                    >
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                        </TableHeader>
                        <TableBody items={inboundData ?? []}>
                            {(item) => (
                                <TableRow key={item?.id}>
                                    {(columnKey) => (
                                        <TableCell
                                            className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${["inboundCode", "createdBy"].includes(columnKey as string) ? "text-left" : ""}`}
                                        >
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/*<Modal isOpen={isOpen} onOpenChange={onOpenChange}>*/}
                {/*    <ModalContent>*/}
                {/*        {(onClose) => (*/}
                {/*            <>*/}
                {/*                <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>*/}
                {/*                <ModalBody>*/}
                {/*                    <p>Bạn có chắc muốn xóa chi nhánh này không</p>*/}
                {/*                </ModalBody>*/}
                {/*                <ModalFooter>*/}
                {/*                    <Button color="default" variant="light" onPress={onClose}>*/}
                {/*                        Hủy*/}
                {/*                    </Button>*/}
                {/*                    <Button*/}
                {/*                        color="danger"*/}
                {/*                        onPress={() => {*/}
                {/*                            handleDelete(selectedId);*/}
                {/*                            onClose();*/}
                {/*                        }}*/}
                {/*                    >*/}
                {/*                        Xóa*/}
                {/*                    </Button>*/}
                {/*                </ModalFooter>*/}
                {/*            </>*/}
                {/*        )}*/}
                {/*    </ModalContent>*/}
                {/*</Modal>*/}
            </div>
        );
    }
};

export default InboundTable;

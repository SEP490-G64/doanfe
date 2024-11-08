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

import { deleteBranch, getListOutbound } from "@/services/outboundServices";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import { outboundColumns } from "@/utils/data";
import { Outbound } from "@/types/outbound";
import { formatDateTime } from "@/utils/methods";

const OutboundTable = () => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [outboundData, setOutboundData] = useState<Outbound[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { sessionToken } = useAppContext();

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const getListOutboundByPage = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getListOutbound(page - 1, rowsPerPage, sessionToken);

            if (response.message === "200 OK") {
                setOutboundData(
                    response.data.map((item: Outbound, index: number) => ({
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

    const handleOpenModal = (outboundId: string) => {
        setSelectedId(outboundId);
        onOpen();
    };

    const handleDelete = async (outboundId: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await deleteBranch(outboundId, sessionToken);

            if (response === "200 OK") {
                await getListOutboundByPage();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getListOutboundByPage();
    }, [page, rowsPerPage]);

    const renderOutboundStatus = useCallback((status: string) => {
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
            case "DANG_XU_LY":
                return (
                    <p className={"inline-flex rounded-full bg-warning/10 px-3 py-1 text-sm font-medium text-primary"}>
                        Đang xử lý
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

    const renderOutboundType = useCallback((outboundType: string) => {
        switch (outboundType) {
            case "CHUYEN_KHO_NOI_BO":
                return <p className="font-normal text-black dark:text-white">Chuyển kho nội bộ</p>;
            case "TRA_HANG":
                return <p className="font-normal text-black dark:text-white">Trả hàng</p>;
            case "HUY_HANG":
                return <p className="font-normal text-black dark:text-white">Hủy hàng</p>;
            case "BAN_HANG":
                return <p className="font-normal text-black dark:text-white">Bán hàng</p>;
        }
    }, []);

    const renderCell = useCallback((outbound: Outbound, columnKey: React.Key) => {
        const cellValue =
            outbound[
                columnKey as
                    | "id"
                    | "outBoundCode"
                    | "outboundType"
                    | "outboundBatchDetails"
                    | "outboundDetails"
                    | "status"
                    | "totalPrice"
            ];

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{outbound.index}</h5>;
            case "outboundCode":
                return <h5 className="font-normal text-black dark:text-white">{outbound.outBoundCode}</h5>;
            case "outboundName":
                return (
                    <p className="font-normal text-black dark:text-white">
                        {outbound.supplier?.supplierName || outbound.fromBranch?.branchName}
                    </p>
                );
            case "outboundType":
                return renderOutboundType(outbound.outboundType);
            case "createdBy":
                return (
                    <p className="font-normal text-black dark:text-white">{`${outbound.createdBy.firstName} ${outbound.createdBy.lastName}`}</p>
                );
            case "status":
                return renderOutboundStatus(outbound.status);
            case "totalPrice":
                return (
                    <p className={"font-normal text-primary"}>
                        {outbound.totalPrice && outbound.totalPrice.toLocaleString()}
                    </p>
                );
            case "createdDate":
                return <p className="font-normal text-black dark:text-white">{formatDateTime(outbound.createdDate)}</p>;
            case "actions":
                return (
                    <div className="flex items-center justify-center space-x-3.5">
                        <Tooltip content="Chi tiết">
                            <button
                                className="hover:text-primary"
                                onClick={() => router.push(`/outbound/details/${outbound.id}`)}
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
                                onClick={() => router.push(`/outbound/update/${outbound.id}`)}
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
    else
        return (
            <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                <div className="max-w-full overflow-x-auto">
                    <Table
                        bottomContent={
                            totalPages > 0 ? (
                                <div className="flex w-full justify-between">
                                    <Select
                                        label="Số bản ghi / trang"
                                        selectedKeys={[rowsPerPage.toString()]}
                                        onChange={(e) => {
                                            setRowsPerPage(parseInt(e.target.value));
                                            setPage(1);
                                        }}
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
                        aria-label="Outbound Table"
                    >
                        <TableHeader>
                            <TableHeader columns={outboundColumns}>
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
                        <TableBody items={outboundData ?? []}>
                            {(item) => (
                                <TableRow key={item?.id}>
                                    {(columnKey) => (
                                        <TableCell
                                            className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${["outboundName", "location"].includes(columnKey as string) ? "text-left" : ""}`}
                                        >
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                <ModalBody>
                                    <p>Bạn có chắc muốn xóa đơn xuất này không</p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="default" variant="light" onPress={onClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            handleDelete(selectedId);
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

export default OutboundTable;

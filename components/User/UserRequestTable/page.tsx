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
import { TiTick } from "react-icons/ti";
import { useRouter } from "next/navigation";

import {approveUser, getRegistrationRequests, getUserById} from "@/services/userServices";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import Loader from "@/components/common/Loader";
import { userColumns } from "@/utils/data";
import { User } from "@/types/user";
import { CiNoWaitingSign } from "react-icons/ci";
import SwitcherStatus from "@/components/Switchers/SwitcherStatus";
import UserForm from "@/components/User/UserForm/page";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";

const UserRequestTable = () => {
    const router = useRouter();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedId, setSelectedId] = useState<string>("");
    const [action, setAction] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [UserData, setUserData] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const { sessionToken } = useAppContext();

    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;

    const totalPages = useMemo(() => {
        return Math.ceil(total / rowsPerPage);
    }, [total, rowsPerPage]);

    const getRegistrationRequestList = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }

        setLoading(true);
        try {
            const response = await getRegistrationRequests(page - 1, sessionToken);

            if (response.message === "200 OK") {
                setUserData(
                    response.data.map((item: User, index: number) => ({
                        ...item,
                        index: index + 1 + (page - 1) * 10,
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

    const handleOpenModal = (UserId: string, Action: string) => {
        setSelectedId(UserId);
        setAction(Action);
        onOpen();
    };

    const getUserInfo = async (userId: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getUserById(userId, sessionToken);
            console.log(response)

            if (response.message === "200 OK") {
                return response.data;
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (UserId: string, accept: boolean): Promise<string> => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return "error"; // Trả về "error" nếu đang trong quá trình xử lý
        }

        const userInfo = await getUserInfo(UserId);
        if (accept && !userInfo?.branch) {
            toast.error("Vui lòng cập nhật chi nhánh trước khi duyệt");
            return "error"; // Trả về "error" nếu không có chi nhánh
        }

        setLoading(true);
        try {
            const response = await approveUser(UserId, accept, sessionToken);

            if (response.message === "200 OK") {
                await getRegistrationRequestList();
                return "success"; // Trả về "success" khi duyệt thành công
            }
        } catch (error) {
            console.log(error);
            return "err"; // Trả về "err" nếu có lỗi xảy ra
        } finally {
            setLoading(false);
        }
        return "error"; // Trả về "error" nếu không có giá trị nào được trả về trước đó
    };

    useEffect(() => {
        getRegistrationRequestList();
    }, [page, rowsPerPage]);

    const renderCell = useCallback((user: User, columnKey: React.Key) => {
        const cellValue = user[columnKey as "id" | "userName" | "email" | "branch" | "roles" | "status" ];
        console.log(user);

        switch (columnKey) {
            case "no.":
                return <h5 className="text-black dark:text-white">{user.index}</h5>;
            case "userName":
                return <h5 className="font-normal text-black dark:text-white">{user.userName}</h5>;
            case "email":
                return <h5 className="font-normal text-black dark:text-white">{user.email}</h5>;
            case "branch":
                return <h5 className="font-normal text-black dark:text-white">{user.branch?.location}</h5>;
            case "roles":
                return <h5 className="font-normal text-black dark:text-white">{user.roles?.at(0)?.type}</h5>;
            case "status":
                return (
    <p
        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium bg-warning/10 text-warning`}
    >
        Chờ duyệt
    </p>
);
            case "actions":
                return (
                    <div className="flex items-center justify-center space-x-3.5">
                        <Tooltip color="secondary" content="Duyệt">
                            <button
                                className="hover:text-secondary"
                                onClick={() => handleOpenModal(user.id.toString(), "APPROVE")}>
                                <TiTick />
                            </button>
                        </Tooltip>
                        <Tooltip color="danger" content="Từ chối">
                            <button className="hover:text-danger"
                                    onClick={() => handleOpenModal(user.id.toString(), "REJECT")}>
                                <CiNoWaitingSign />
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
        if (!userInfo?.roles?.some(role => role.type === 'ADMIN')) {
            return (
                <Unauthorized></Unauthorized>
            );
        }
        return (
            <div
                className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default sm:px-7.5 xl:pb-1 dark:border-strokedark dark:bg-boxdark">
                Tìm thấy <span className="font-bold text-blue-600">{total}</span> yêu cầu đăng kí
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
                        aria-label="Registration Request Table"
                    >
                        <TableHeader>
                            <TableHeader columns={userColumns}>
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
                        <TableBody items={UserData ?? []} emptyContent={"Không có dữ liệu"}>
                            {(item) => (
                                <TableRow key={item?.id}>
                                    {(columnKey) => (
                                        <TableCell
                                            className={`border-b border-[#eee] px-4 py-5 text-center dark:border-strokedark ${["userName", "email"].includes(columnKey as string) ? "text-left" : ""}`}
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
                                    {(() => {
                                        switch (action) {
                                            case "REJECT":
                                                return <UserForm viewMode="reject" userId={selectedId} />;
                                            case "APPROVE":
                                                return <UserForm viewMode="approve" userId={selectedId} />;
                                        }
                                    })()}
                                    {(() => {
                                        switch (action) {
                                            case "REJECT":
                                                return <p>Bạn có chắc muốn từ chối người dùng này không?</p>;
                                            case "APPROVE":
                                                return <p>Bạn có chắc muốn duyệt người dùng này không?</p>;
                                        }
                                    })()}
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="default" variant="light" onPress={onClose}>
                                        Hủy
                                    </Button>
                                    <Button
                                        color={(() => {
                                            switch (action) {
                                                case "REJECT":
                                                    return "danger";
                                                case "APPROVE":
                                                    return "success";
                                            }
                                        })()}
                                        onPress={async () => {
                                            const result = await (() => {
                                                switch (action) {
                                                    case "REJECT":
                                                        return handleApprove(selectedId, false);
                                                    case "APPROVE":
                                                        return handleApprove(selectedId, true);
                                                }
                                            })();

                                            // Chỉ đóng modal khi không gặp lỗi trong xử lý
                                            if (result !== "error") {
                                                onClose();
                                            }
                                        }}
                                    >
                                        {(() => {
                                            switch (action) {
                                                case "REJECT":
                                                    return "Từ chối";
                                                case "APPROVE":
                                                    return "Duyệt";
                                            }
                                        })()}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        );
    }
};

export default UserRequestTable;

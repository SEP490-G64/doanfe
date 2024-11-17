"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import ReactSelect from "react-select";

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import IconButton from "@/components/UI/IconButton";
import { ProductInfor } from "@/types/inventoryCheck";
import Loader from "@/components/common/Loader";
import {
    changeInventoryCheckStatus,
    createInitInventoryCheck,
    getInventoryCheckById,
    submitDraft,
    submitInventoryCheck,
} from "@/services/inventoryCheckServices";
import { CheckBody, CheckBodyType } from "@/lib/schemaValidate/inventoryCheckSchema";
import { getProductByBranchId } from "@/services/productServices";
import { TokenDecoded } from "@/types/tokenDecoded";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import ProductsTableInventoryCheck from "../Tables/ProductsTableInventoryCheck";

const InventoryCheckForm = ({
    viewMode,
    inventoryCheckId,
}: {
    viewMode: "details" | "update" | "create";
    inventoryCheckId?: string;
}) => {
    const [loading, setLoading] = useState(false);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [user, setUser] = useState<{ firstName: string; lastName: string } | undefined>();
    const [branch, setBranch] = useState<{ id: number; branchName: string } | undefined>();
    const [inventoryCheckStatus, setInventoryCheckStatus] = useState<string | undefined>();
    const [productOpts, setProductOpts] = useState<ProductInfor[]>([]);
    const { isOpen, onOpenChange } = useDisclosure();
    const [product, setProduct] = useState<ProductInfor>();
    const [saveDraft, setSaveDraft] = useState(false);

    const renderInventoryCheckStatus = useCallback((status: string | undefined) => {
        if (!status) return;
        switch (status) {
            case "CHUA_LUU":
                return (
                    <p className={"inline-flex rounded bg-danger/10 px-3 py-1 text-sm font-medium text-danger"}>
                        Khởi tạo
                    </p>
                );
            case "BAN_NHAP":
                return (
                    <p className={"inline-flex rounded bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Bản nháp
                    </p>
                );
            case "CHO_DUYET":
                return (
                    <p className={"inline-flex rounded bg-primary/10 px-3 py-1 text-sm font-medium text-primary"}>
                        Chờ duyệt
                    </p>
                );
            case "KIEM_HANG":
                return (
                    <p className={"inline-flex rounded bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary"}>
                        Kiểm hàng
                    </p>
                );
            case "DANG_THANH_TOAN":
                return (
                    <p className={"inline-flex rounded bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Đang thanh toán
                    </p>
                );
            case "HOAN_THANH":
                return (
                    <p className={"inline-flex rounded bg-success/10 px-3 py-1 text-sm font-medium text-success"}>
                        Hoàn thành
                    </p>
                );
        }
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CheckBodyType>({
        resolver: zodResolver(CheckBody),
        defaultValues: {
            inventoryCheckId: undefined,
            code: undefined,
            createdDate: undefined,
            note: undefined,
            createdBy: undefined,
            branch: undefined,
            inventoryCheckProductDetails: [],
        },
    });

    const products = watch("inventoryCheckProductDetails");
    const branchId = watch("branch.id");

    // Debounced fetch options
    const debouncedFetchOptions = useCallback(
        debounce((inputValue: string) => {
            if (inputValue) {
                getProductOpts(inputValue);
            } else {
                setProductOpts([]);
            }
        }, 500),
        [branchId]
    );

    const handleTypeProduct = (inputString: string) => {
        debouncedFetchOptions(inputString);
        return inputString;
    };

    const addItem = (e?: React.MouseEvent) => {
        e!.preventDefault();
        setValue("inventoryCheckProductDetails", [...products, product]);
    };

    const initInventoryCheck = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await createInitInventoryCheck(sessionToken);

            if (response.status === "SUCCESS") {
                setValue("inventoryCheckId", response.data.id);
                setValue("code", response.data.code);
                setValue("createdDate", response.data.createdDate);
                setValue("branch.id", response.data.branch.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy.id);
                setUser(response.data.createdBy);
                setBranch(response.data.branch);
                setInventoryCheckStatus(response.data.status);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getInforInventoryCheck = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getInventoryCheckById(inventoryCheckId as string, sessionToken);

            if (response.message === "200 OK") {
                setValue("inventoryCheckId", response.data.id);
                setValue("createdDate", response.data.createdDate);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy?.id);
                setValue("inventoryCheckProductDetails", response.data.inventoryCheckProductDetails);
                setUser(response.data.createdBy);
                setBranch(response.data.branch);
                setInventoryCheckStatus(response.data.status);
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getProductOpts = async (inputString: string) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            // let response;
            // if (inventory-checkType === "TRA_HANG")
            //     response = await getProductByBranchId(
            //         branch!.id.toString(),
            //         inputString,
            //         sessionToken,
            //         selectedSupId.toString()
            //     );
            const response = await getProductByBranchId(branch!.id.toString(), inputString, sessionToken);
            if (response.message === "200 OK") {
                setProductOpts(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetchingProduct(false);
        }
    };

    useEffect(() => {
        if (viewMode === "create") {
            onOpenChange();
        } else {
            getInforInventoryCheck();
        }
    }, []);

    const handleChangeStatus = async (e: React.MouseEvent, status: string) => {
        e.preventDefault();
        const response = await changeInventoryCheckStatus(inventoryCheckId as string, status, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/inventory-check-note/list");
            router.refresh();
        }
    };

    const handleSubmitInventoryCheck = async (e: React.MouseEvent) => {
        e.preventDefault();
        const response = await submitInventoryCheck(inventoryCheckId as string, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/inventory-check-note/list");
            router.refresh();
            await changeInventoryCheckStatus(inventoryCheckId as string, "HOAN_THANH", sessionToken);
        }
    };

    const onSubmit = async (inventoryCheck: CheckBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        console.log(inventoryCheck);
        setLoading(true);
        try {
            const response = await submitDraft(inventoryCheck, sessionToken);

            if (response && response.status === "SUCCESS") {
                if (!saveDraft)
                    await changeInventoryCheckStatus(watch("inventoryCheckId")!.toString(), "CHO_DUYET", sessionToken);
                router.push("/inventory-check-note/list");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* <!--  Thông tin người duyệt --> */}
            {/* {viewMode !== "create" && (
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="p-6.5">
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <div className="flex w-full items-center gap-2 xl:w-1/2">
                                <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                    Người duyệt: <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập người duyệt"
                                    disabled={viewMode === "details"}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="flex w-full items-center gap-2 xl:w-1/2">
                                <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                    Ngày duyệt: <span className="text-meta-1">*</span>
                                </label>
                                <DatePickerOne disabled={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )} */}

            {/* <!-- Input Fields --> */}
            <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Thông tin nhà cung cấp</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Người tạo <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={user ? `${user?.firstName} ${user?.lastName}` : ""}
                                placeholder="Nhập tên người tạo"
                                disabled
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Ngày tạo
                            </label>
                            <DatePickerOne dateValue={watch("createdDate")} disabled={true} />
                        </div>
                    </div>

                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Chi nhánh <span className="text-meta-1">*</span>
                            </label>
                            <input
                                type="text"
                                defaultValue={branch?.branchName}
                                disabled
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">Mã đơn</label>
                            <input
                                type="text"
                                defaultValue={watch("code")}
                                disabled
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Ghi chú <span className="text-meta-1">*</span>
                        </label>
                        <textarea
                            {...register("note")}
                            rows={5}
                            placeholder="Nhập ghi chú"
                            disabled={viewMode === "details"}
                            className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        ></textarea>
                    </div>

                    <div className="mb-4.5">
                        <label className="mb-3 mr-3 inline-flex text-sm font-medium text-black dark:text-white">
                            Trạng thái đơn:
                        </label>
                        {renderInventoryCheckStatus(inventoryCheckStatus)}
                    </div>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Danh sách sản phẩm</h3>
                </div>
                <div className="p-6.5">
                    {viewMode !== "details" && (
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <label className="mb-3 block self-center whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                Tên sản phẩm <span className="text-meta-1">*</span>
                            </label>
                            <ReactSelect
                                defaultValue={product ? product.registrationCode : ""}
                                onChange={(optionValue) => {
                                    if (!optionValue) return;
                                    const option = productOpts.find(
                                        (opt) => opt.registrationCode === optionValue.value
                                    );
                                    setProduct({
                                        ...option,
                                        baseUnit: option?.productBaseUnit,
                                        product: {
                                            id: option?.id,
                                            productName: option?.productName,
                                            productCode: option?.registrationCode,
                                        },
                                        batch: {
                                            id: undefined,
                                            batchCode: undefined,
                                            expireDate: undefined,
                                        },
                                        systemQuantity: 0,
                                        countedQuantity: 0,
                                        difference: 0,
                                        reason: undefined,
                                    });
                                }}
                                onInputChange={handleTypeProduct}
                                options={productOpts.map((option) => ({
                                    value: option.registrationCode,
                                    label: option.productName,
                                }))}
                                placeholder="Tìm kiếm sản phẩm..."
                                isSearchable
                                isClearable
                                isLoading={isFetchingProduct}
                                styles={{
                                    control: (baseStyles, state) => ({
                                        ...baseStyles,
                                        width: "100%",
                                        padding: "0.75rem 1.25rem",
                                        cursor: "text",
                                    }),
                                }}
                                className={"w-full"}
                            />
                            <IconButton icon={<FaPlus />} onClick={(e) => addItem(e)} />
                        </div>
                    )}

                    <ProductsTableInventoryCheck
                        data={products || []}
                        active={
                            viewMode !== "details" && ["BAN_NHAP", "CHUA_LUU"].includes(inventoryCheckStatus as string)
                        }
                        errors={errors}
                        setProducts={setValue}
                    />

                    {viewMode === "details" && ["KIEM_HANG"].includes(inventoryCheckStatus as string) && (
                        <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                            <button
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                type="submit"
                                onClick={(e) => handleSubmitInventoryCheck(e)}
                            >
                                Kiểm hàng
                            </button>
                        </div>
                    )}

                    {viewMode === "details" &&
                        ["BAN_NHAP"].includes(inventoryCheckStatus as string) &&
                        userInfo?.roles[0].type === "STAFF" && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                    onClick={(e) => handleChangeStatus(e, "CHO_DUYET")}
                                >
                                    Gửi đơn
                                </button>
                            </div>
                        )}

                    {viewMode === "details" &&
                        ["CHO_DUYET", "BAN_NHAP"].includes(inventoryCheckStatus as string) &&
                        (userInfo?.roles[0].type === "ADMIN" || userInfo?.roles[0].type === "MANAGER") && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                    onClick={(e) => handleSubmitInventoryCheck(e)}
                                >
                                    Duyệt Đơn
                                </button>
                            </div>
                        )}

                    {viewMode === "create" && (
                        <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                            <div className="w-1/2">
                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                    onClick={() => console.log(errors)}
                                >
                                    Tạo và gửi đơn
                                </button>
                            </div>
                            <div className="w-1/2">
                                <button
                                    className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                    type="submit"
                                    onClick={() => setSaveDraft(true)}
                                >
                                    Lưu đơn
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                            <ModalBody>
                                <p>Bạn có muốn khởi tạo đơn kiểm hàng không?</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        toast.error("Khởi tạo đơn kiểm hàng thất bại");
                                    }}
                                >
                                    Không
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={async () => {
                                        await initInventoryCheck();
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
    );
};

export default InventoryCheckForm;

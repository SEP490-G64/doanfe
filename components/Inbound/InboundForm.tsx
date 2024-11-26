"use client";
import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
    Select,
    SelectItem,
} from "@nextui-org/react";

import ReactSelect from "react-select";
import { debounce } from "lodash";
import { jwtDecode } from "jwt-decode";
import { FaPlus } from "react-icons/fa6";
import { TfiSupport } from "react-icons/tfi";
import { AiOutlineShop } from "react-icons/ai";

import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import ProductsTableBeforeCheck from "@/components/Tables/ProductsTableBeforeCheck";
import IconButton from "@/components/UI/IconButton";
import {
    changeInboundStatus,
    createInitInbound,
    deleteInbound,
    getInboundById,
    submitDraft,
    submitInbound,
} from "@/services/inboundServices";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { InboundBody, InboundBodyType } from "@/lib/schemaValidate/inboundSchema";
import { getAllSupplier } from "@/services/supplierServices";
import { Supplier } from "@/types/supplier";
import Loader from "@/components/common/Loader";
import { TokenDecoded } from "@/types/tokenDecoded";
import ProductsTableAfterCheck from "@/components/Tables/ProductsTableAfterCheck";
import {
    getAllowedProducts,
    getListProduct,
    getProductByBranchId,
    searchAllProductsByKeyword,
} from "@/services/productServices";
import { ProductInfor } from "@/types/inbound";
import { getAllBranch } from "@/services/branchServices";
import { Branch } from "@/types/branch";
import Unauthorized from "@/components/common/Unauthorized";
import { DataSearch } from "@/types/product";

const InboundForm = ({ viewMode, inboundId }: { viewMode: "details" | "update" | "create"; inboundId?: string }) => {
    const [loading, setLoading] = useState(false);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [user, setUser] = useState<{ firstName: string; lastName: string } | undefined>();
    const [branch, setBranch] = useState<{ id: number; branchName: string } | undefined>();
    const [inboundStatus, setInboundStatus] = useState<string | undefined>();
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [productOpts, setProductOpts] = useState<ProductInfor[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inboundType, setInboundType] = useState<"NHAP_TU_NHA_CUNG_CAP" | "CHUYEN_KHO_NOI_BO">(
        "NHAP_TU_NHA_CUNG_CAP"
    );
    const [product, setProduct] = useState<ProductInfor>();
    const [saveDraft, setSaveDraft] = useState(false);

    const renderInboundStatus = useCallback((status: string | undefined) => {
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
            case "CHO_HANG":
                return (
                    <p className={"inline-flex rounded bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
                        Chờ hàng
                    </p>
                );
            case "KIEM_HANG":
                return (
                    <p className={"inline-flex rounded bg-warning/10 px-3 py-1 text-sm font-medium text-warning"}>
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
    } = useForm<InboundBodyType>({
        resolver: zodResolver(InboundBody),
        defaultValues: {
            inboundId: undefined,
            inboundCode: undefined,
            inboundType: undefined,
            createdDate: undefined,
            note: undefined,
            createdBy: undefined,
            supplier: { id: "" },
            fromBranch: { id: "" },
            toBranch: undefined,
            productInbounds: [],
        },
    });

    const products = watch("productInbounds");
    const selectedSupId = watch("supplier.id");
    const selectedFromBranchId = watch("fromBranch.id");

    // Debounced fetch options
    const debouncedFetchOptions = useCallback(
        debounce((inputValue: string) => {
            if (inputValue) {
                getProductOpts(inputValue);
            } else {
                setProductOpts([]);
            }
        }, 500),
        [selectedSupId, selectedFromBranchId]
    );

    const handleTypeProduct = (inputString: string) => {
        debouncedFetchOptions(inputString);
        return inputString;
    };

    const addItem = (e?: React.MouseEvent) => {
        e!.preventDefault();
        setValue("productInbounds", [...products, { ...product, baseUnit: { id: 1, unitName: "Viên" } }]);
    };

    const initInbound = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await createInitInbound(inboundType, sessionToken);

            if (response.status === "SUCCESS") {
                setValue("inboundId", response.data.id);
                setValue("inboundCode", response.data.inboundCode);
                setValue("inboundType", response.data.inboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("toBranch.id", response.data.toBranch.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy.id);
                setUser(response.data.createdBy);
                setBranch(response.data.toBranch);
                setInboundStatus(response.data.status);

                if (inboundType === "CHUYEN_KHO_NOI_BO") await getBranchOpts(response.data.toBranch.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getInforInbound = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getInboundById(inboundId as string, sessionToken);

            if (response.message === "200 OK") {
                setValue("inboundId", response.data.id);
                setValue("inboundCode", response.data.inboundCode);
                setValue("inboundType", response.data.inboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("toBranch.id", response.data.toBranch.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy?.id);
                setValue("supplier.id", response.data.supplier.id);
                setValue("productInbounds", response.data.productBatchDetails);
                setUser(response.data.createdBy);
                setBranch(response.data.toBranch);
                setInboundStatus(response.data.status);
                setInboundType(response.data.inboundType);
                setSelectedSupplier(response.data.supplier);
                setSelectedFromBranch(response.data.fromBranch);

                if (inboundType === "CHUYEN_KHO_NOI_BO") await getBranchOpts(response.data.toBranch.id);

                console.log(response.data);
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getSupplierOpts = async () => {
        try {
            const response = await getAllSupplier(sessionToken);

            if (response.message === "200 OK") {
                setSuppliers(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getBranchOpts = async (currentBranchId: string) => {
        try {
            const response = await getAllBranch(sessionToken);
            console.log(currentBranchId);

            if (response.message === "200 OK") {
                setBranches(response.data.filter((b: Branch) => b.id !== currentBranchId));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getProductOpts = async (inputString: string) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            let response;
            if (inboundType === "NHAP_TU_NHA_CUNG_CAP") {
                response = await searchAllProductsByKeyword(inputString, sessionToken);
            } else response = await getProductByBranchId(branch!.id.toString(), inputString, false, sessionToken);
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
        getSupplierOpts();
        if (viewMode === "create") {
            onOpen();
        } else {
            getInforInbound();
        }
    }, []);

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
    const [selectedFromBranch, setSelectedFromBranch] = useState<Branch | undefined>();

    useEffect(() => {
        if (selectedSupId) {
            const sup = suppliers.find((item: Supplier) => item.id.toString() === selectedSupId);
            setSelectedSupplier(sup);
        }
    }, [selectedSupId]);

    useEffect(() => {
        if (selectedFromBranchId) {
            const branch = branches.find((item: Branch) => item.id.toString() === selectedFromBranchId);
            setSelectedFromBranch(branch);
        }
    }, [selectedFromBranchId]);

    const handleOnClick = async (e: React.MouseEvent, status: string) => {
        e.preventDefault();
        const response = await changeInboundStatus(inboundId as string, status, sessionToken);
        if (response.status === "SUCCESS") {
            router.refresh();
            await getInforInbound();
            if (inboundStatus === "CHO_HANG") router.push(`/inbound/update/${inboundId}`);
        }
    };

    const handleSubmitInbound = async (e?: React.MouseEvent) => {
        e?.preventDefault();
        const response = await submitInbound(inboundId as string, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/inbound/list");
            router.refresh();
            await changeInboundStatus(inboundId as string, "HOAN_THANH", sessionToken);
        }
    };

    const onSubmit = async (inbound: InboundBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        console.log(inbound);
        setLoading(true);
        try {
            if (inboundType === "NHAP_TU_NHA_CUNG_CAP") delete inbound.fromBranch;
            else delete inbound.supplier;
            const response = await submitDraft(inbound, sessionToken);

            if (response && response.status === "SUCCESS") {
                if (inboundStatus === "KIEM_HANG")
                    await changeInboundStatus(inboundId as string, "KIEM_HANG", sessionToken);
                if (!saveDraft && inboundStatus === "CHUA_LUU")
                    await changeInboundStatus(watch("inboundId")!.toString(), "CHO_DUYET", sessionToken);
                if (!saveDraft && inboundStatus === "KIEM_HANG") await handleSubmitInbound();
                router.push("/inbound/list");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (inboundStatus === "CHUA_LUU") {
            const handleBeforeUnload = (event: any) => {
                event.preventDefault();
                event.returnValue = "Đơn khởi tạo sẽ bị xóa";
            };

            const handleUnload = async () => {
                try {
                    if (watch("inboundId")) await deleteInbound(watch("inboundId")!.toString(), sessionToken);
                } catch (error) {
                    console.error("Failed to send DELETE request:", error);
                }
            };

            // Xử lý thoát trình duyệt
            window.addEventListener("beforeunload", handleBeforeUnload);
            window.addEventListener("unload", handleUnload);

            return () => {
                window.removeEventListener("beforeunload", handleBeforeUnload);
                window.removeEventListener("unload", handleUnload);
            };
        }
    }, [inboundStatus]);

    if (loading) return <Loader />;
    else {
        if (!userInfo?.roles?.some((role) => role.type === "MANAGER" || role.type === "STAFF")) {
            return <Unauthorized></Unauthorized>;
        }
        return (
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate method={"post"}>
                {/* <!--  Thông tin người duyệt --> */}
                {viewMode !== "create" && userInfo?.roles[0].type !== "ADMIN" && (
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
                                    <DatePickerOne disabled={viewMode === "details"} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* <!-- Input Fields --> */}
                <div className="flex gap-3">
                    <div className="w-7/12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Thông tin nhà cung cấp</h3>
                        </div>
                        {inboundType === "NHAP_TU_NHA_CUNG_CAP" ? (
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tên nhà cung cấp <span className="text-meta-1">*</span>
                                        </label>
                                        <SelectGroupTwo
                                            register={{ ...register("supplier.id") }}
                                            watch={watch("supplier.id")}
                                            icon={<TfiSupport />}
                                            placeholder="Chọn nhà cung cấp"
                                            disabled={
                                                viewMode === "details" ||
                                                !["BAN_NHAP", "CHUA_LUU"].includes(inboundStatus as string)
                                            }
                                            data={suppliers.map((supplier: Supplier) => ({
                                                label: supplier.supplierName,
                                                value: supplier.id,
                                            }))}
                                        />
                                        {errors.supplier?.id && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.supplier.id.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Số điện thoại
                                        </label>
                                        <input
                                            defaultValue={
                                                selectedSupplier?.phoneNumber ? selectedSupplier?.phoneNumber : ""
                                            }
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            disabled
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Địa chỉ <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        defaultValue={selectedSupplier?.address ? selectedSupplier?.address : ""}
                                        placeholder="Nhập địa chỉ"
                                        disabled
                                        className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></input>
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        {...register("note")}
                                        rows={3}
                                        placeholder="Nhập ghi chú"
                                        disabled={viewMode === "details"}
                                        className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tên chi nhánh xuất <span className="text-meta-1">*</span>
                                        </label>
                                        <SelectGroupTwo
                                            register={{ ...register("fromBranch.id") }}
                                            watch={watch("fromBranch.id")}
                                            icon={<AiOutlineShop />}
                                            placeholder="Chọn chi nhánh xuất"
                                            disabled={
                                                viewMode === "details" ||
                                                !["CHUA_LUU", "BAN_NHAP"].includes(inboundStatus as string)
                                            }
                                            data={branches.map((branch: Branch) => ({
                                                label: branch.branchName,
                                                value: branch.id,
                                            }))}
                                        />
                                        {errors.fromBranch?.id && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.fromBranch.id.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Số điện thoại
                                        </label>
                                        <input
                                            defaultValue={
                                                selectedFromBranch?.phoneNumber ? selectedFromBranch?.phoneNumber : ""
                                            }
                                            type="text"
                                            placeholder="Nhập số điện thoại"
                                            disabled
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Địa chỉ <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        defaultValue={selectedFromBranch?.location ? selectedFromBranch?.location : ""}
                                        placeholder="Nhập địa chỉ"
                                        disabled
                                        className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></input>
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        {...register("note")}
                                        rows={3}
                                        placeholder="Nhập ghi chú"
                                        disabled={
                                            viewMode === "details" ||
                                            ["CHO_DUYET", "CHO_HANG", "HOAN_THANH"].includes(inboundStatus as string)
                                        }
                                        className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="w-5/12 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">Thông tin đơn đặt hàng</h3>
                        </div>
                        <div className="p-6.5">
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Người tạo <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    defaultValue={user ? `${user?.firstName} ${user?.lastName}` : ""}
                                    type="text"
                                    placeholder="Nhập người tạo"
                                    disabled
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                <div className={`w-full ${viewMode !== "create" ? "xl:w-5/12" : ""}`}>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Ngày tạo đơn
                                    </label>
                                    <DatePickerOne dateValue={watch("createdDate")} disabled={true} />
                                </div>

                                {viewMode !== "create" && (
                                    <div className="w-full xl:w-7/12">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Mã đơn
                                        </label>
                                        <input
                                            {...register("inboundCode")}
                                            type="text"
                                            placeholder="Nhập mã đơn"
                                            disabled
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Chi nhánh <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    defaultValue={branch?.branchName}
                                    type="text"
                                    placeholder="Nhập chi nhánh"
                                    disabled
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mb-4.5">
                                <label className="mb-3 mr-3 inline-flex text-sm font-medium text-black dark:text-white">
                                    Trạng thái đơn:
                                </label>
                                {renderInboundStatus(inboundStatus)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">Danh sách sản phẩm</h3>
                    </div>
                    <div className="p-6.5">
                        {viewMode !== "details" && ["CHUA_LUU", "BAN_NHAP"].includes(inboundStatus as string) && (
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
                                        setProduct(option);
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

                        {["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(inboundStatus as string) ? (
                            viewMode === "details" ? (
                                <ProductsTableAfterCheck
                                    data={
                                        products.map((p) =>
                                            !p.batches || p.batches.length === 0
                                                ? {
                                                      ...p,
                                                      batches: [
                                                          {
                                                              batchCode: undefined,
                                                              inboundBatchQuantity: 0,
                                                              inboundPrice: 0,
                                                              expireDate: undefined,
                                                          },
                                                      ],
                                                  }
                                                : p
                                        ) || []
                                    }
                                    active={viewMode !== "details" && inboundStatus === "KIEM_HANG"}
                                    errors={errors}
                                    setProducts={setValue}
                                />
                            ) : (
                                <ProductsTableAfterCheck
                                    data={
                                        products.map((p) =>
                                            !p.batches || p.batches.length === 0
                                                ? {
                                                      ...p,
                                                      batches: [
                                                          {
                                                              batchCode: undefined,
                                                              inboundBatchQuantity: 0,
                                                              inboundPrice: 0,
                                                              expireDate: undefined,
                                                          },
                                                      ],
                                                  }
                                                : p
                                        ) || []
                                    }
                                    active={inboundStatus === "KIEM_HANG"}
                                    errors={errors}
                                    setProducts={setValue}
                                />
                            )
                        ) : (
                            <ProductsTableBeforeCheck
                                data={products || []}
                                active={
                                    viewMode !== "details" && ["CHUA_LUU", "BAN_NHAP"].includes(inboundStatus as string)
                                }
                                setProducts={setValue}
                            />
                        )}

                        {viewMode === "create" && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => {
                                            setSaveDraft(false);
                                            console.log(errors);
                                        }}
                                        // onClick={() => console.log(errors)}
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

                        {viewMode === "update" && ["CHUA_LUU", "BAN_NHAP"].includes(inboundStatus as string) && (
                            <button
                                className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                type="submit"
                                // onClick={() => console.log(errors)}
                            >
                                Cập nhật
                            </button>
                        )}

                        {viewMode === "update" && ["KIEM_HANG"].includes(inboundStatus as string) && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => setSaveDraft(false)}
                                        // onClick={() => console.log(errors)}
                                    >
                                        Nhập hàng
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        type="submit"
                                        onClick={() => setSaveDraft(true)}
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        )}

                        {viewMode === "details" &&
                            (userInfo?.roles[0].type === "ADMIN" || userInfo?.roles[0].type === "MANAGER") &&
                            ["BAN_NHAP", "CHO_DUYET"].includes(inboundStatus as string) && (
                                <button
                                    className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    onClick={(e) => handleOnClick(e, "CHO_HANG")}
                                >
                                    Duyệt đơn
                                </button>
                            )}
                        {viewMode === "details" &&
                            userInfo?.roles[0].type === "STAFF" &&
                            inboundStatus === "BAN_NHAP" && (
                                <button
                                    className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    onClick={(e) => handleOnClick(e, "CHO_DUYET")}
                                >
                                    Gửi đơn
                                </button>
                            )}
                        {viewMode === "details" && inboundStatus === "CHO_HANG" && (
                            <button
                                className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                onClick={(e) => handleOnClick(e, "KIEM_HANG")}
                            >
                                Kiểm hàng
                            </button>
                        )}
                        {viewMode === "details" && inboundStatus === "KIEM_HANG" && (
                            <button
                                className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                onClick={(e) => handleSubmitInbound(e)}
                            >
                                Nhập hàng
                            </button>
                        )}
                    </div>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onClose} isDismissable={false}>
                    <div>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                    <ModalBody>
                                        <p>Vui lòng chọn kiểu nhập hàng</p>
                                        <Select
                                            value={inboundType}
                                            onChange={(e) =>
                                                setInboundType(
                                                    e.target.value as "NHAP_TU_NHA_CUNG_CAP" | "CHUYEN_KHO_NOI_BO"
                                                )
                                            }
                                            label="Chọn kiểu nhập hàng"
                                            className="max-w-full"
                                        >
                                            <SelectItem key={"NHAP_TU_NHA_CUNG_CAP"}>Nhập từ nhà cung cấp</SelectItem>
                                            <SelectItem key={"CHUYEN_KHO_NOI_BO"}>Chuyển kho nội bộ</SelectItem>
                                        </Select>
                                    </ModalBody>
                                    <ModalFooter>
                                        {/* Nút Không sẽ chỉ đóng modal */}
                                        <Button
                                            color="default"
                                            variant="light"
                                            onPress={() => {
                                                onClose();
                                                toast.error("Khởi tạo đơn nhập hàng thất bại");
                                                router.push(`/inbound/list`);
                                            }}
                                        >
                                            Không
                                        </Button>
                                        {/* Nút Chắc chắn sẽ thực hiện thao tác và đóng modal */}
                                        <Button
                                            color="primary"
                                            onPress={async () => {
                                                await initInbound();
                                                onClose();
                                            }}
                                        >
                                            Chắc chắn
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </div>
                </Modal>
            </form>
        );
    }
};

export default InboundForm;

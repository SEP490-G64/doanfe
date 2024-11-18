"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    useDisclosure,
} from "@nextui-org/react";
import { debounce } from "lodash";
import ReactSelect from "react-select";
import { FaPlus } from "react-icons/fa6";
import { TfiSupport } from "react-icons/tfi";
import { AiOutlineShop } from "react-icons/ai";

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import IconButton from "@/components/UI/IconButton";
import Loader from "@/components/common/Loader";
import { ProductInfor } from "@/types/outbound";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { TokenDecoded } from "@/types/tokenDecoded";
import { OutboundBody, OutboundBodyType } from "@/lib/schemaValidate/outboundSchema";
import { getAllSupplier } from "@/services/supplierServices";
import { getAllBranch } from "@/services/branchServices";
import { Branch } from "@/types/branch";
import { getAllowedProducts, getProductByBranchId } from "@/services/productServices";
import { Supplier } from "@/types/supplier";
import {
    changeOutboundStatus,
    createInitOutbound,
    getOutboundById,
    submitDraft,
    submitDraftForSell,
    submitOutbound,
} from "@/services/outboundServices";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import ProductsTableOutbound from "../Tables/ProductTableOutbound";

const OutboundForm = ({ viewMode, outboundId }: { viewMode: "details" | "update" | "create"; outboundId?: string }) => {
    const [loading, setLoading] = useState(false);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [user, setUser] = useState<{ firstName: string; lastName: string } | undefined>();
    const [branch, setBranch] = useState<{ id: number; branchName: string } | undefined>();
    const [outboundStatus, setOutboundStatus] = useState<string | undefined>();
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [productOpts, setProductOpts] = useState<ProductInfor[]>([]);
    const { isOpen, onOpenChange } = useDisclosure();
    const [outboundType, setOutboundType] = useState<"HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO">();
    const [product, setProduct] = useState<ProductInfor>();
    const [saveDraft, setSaveDraft] = useState(false);

    const renderOutboundStatus = useCallback((status: string | undefined) => {
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
    } = useForm<OutboundBodyType>({
        resolver: zodResolver(OutboundBody),
        defaultValues: {
            outboundId: undefined,
            outboundCode: undefined,
            outboundType: undefined,
            createdDate: undefined,
            note: undefined,
            createdBy: undefined,
            supplier: undefined,
            fromBranch: undefined,
            toBranch: undefined,
            outboundProductDetails: [],
        },
    });

    const products = watch("outboundProductDetails");
    const selectedSupId = watch("supplier.id");
    const selectedToBranchId = watch("toBranch.id");
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
        setValue("outboundProductDetails", [...products, product]);
    };

    const initOutbound = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await createInitOutbound(
                outboundType as "HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO",
                sessionToken
            );

            if (response.status === "SUCCESS") {
                setValue("outboundId", response.data.id);
                setValue("outboundCode", response.data.outboundCode);
                setValue("outboundType", response.data.outboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("fromBranch.id", response.data.fromBranch.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy.id);
                setUser(response.data.createdBy);
                setBranch(response.data.fromBranch);
                setOutboundStatus(response.data.status);

                if (outboundType === "CHUYEN_KHO_NOI_BO") await getBranchOpts(response.data.fromBranch.id);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getInforOutbound = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getOutboundById(outboundId as string, sessionToken);

            if (response.message === "200 OK") {
                setValue("outboundId", response.data.id);
                setValue("outboundCode", response.data.outboundCode);
                setValue("outboundType", response.data.outboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("toBranch.id", response.data.toBranch?.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy?.id);
                setValue("supplier.id", response.data.supplier?.id);
                setValue("outboundProductDetails", response.data.outboundProductDetails);
                setUser(response.data.createdBy);
                setBranch(response.data.toBranch);
                setOutboundStatus(response.data.status);
                setOutboundType(response.data.outboundType);
                setSelectedSupplier(response.data.supplier);
                setSelectedToBranch(response.data.toBranch);

                if (outboundType === "CHUYEN_KHO_NOI_BO") await getBranchOpts(response.data.fromBranch.id);
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
            if (outboundType === "TRA_HANG" || outboundType === "HUY_HANG") {
                response = await getProductByBranchId(branch!.id.toString(), inputString, false, sessionToken);
            }
            else response = await getProductByBranchId(branch!.id.toString(), inputString, true, sessionToken);
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
            onOpenChange();
        } else {
            getInforOutbound();
        }
    }, []);

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
    const [selectedToBranch, setSelectedToBranch] = useState<Branch | undefined>();

    useEffect(() => {
        if (selectedSupId) {
            const sup = suppliers.find((item: Supplier) => Number(item.id) == selectedSupId);
            setSelectedSupplier(sup);
        }
    }, [selectedSupId]);

    useEffect(() => {
        if (selectedToBranchId) {
            const branch = branches.find((item: Branch) => Number(item.id) == selectedToBranchId);
            setSelectedToBranch(branch);
        }
    }, [selectedToBranchId]);

    const handleChangeStatus = async (e: React.MouseEvent, status: string) => {
        e.preventDefault();
        const response = await changeOutboundStatus(outboundId as string, status, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/outbound/list");
            router.refresh();
        }
    };

    const handleSubmitOutbound = async (e: React.MouseEvent) => {
        e.preventDefault();
        const response = await submitOutbound(outboundId as string, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/outbound/list");
            router.refresh();
            await changeOutboundStatus(outboundId as string, "HOAN_THANH", sessionToken);
        }
    };

    const onSubmit = async (outbound: OutboundBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        console.log(outbound);
        setLoading(true);
        try {
            if (outboundType === "CHUYEN_KHO_NOI_BO") delete outbound.supplier;
            else if (outboundType === "TRA_HANG") delete outbound.toBranch;
            else {
                delete outbound.supplier;
                delete outbound.toBranch;
            }

            let response;
            if (outboundType !== "BAN_HANG") response = await submitDraft(outbound, sessionToken);
            else response = await submitDraftForSell(outbound, sessionToken);

            if (response && response.status === "SUCCESS") {
                if (!saveDraft && outboundType !== "BAN_HANG")
                    await changeOutboundStatus(watch("outboundId")!.toString(), "CHO_DUYET", sessionToken);
                if (!saveDraft && outboundType === "BAN_HANG")
                    await changeOutboundStatus(watch("outboundId")!.toString(), "HOAN_THANH", sessionToken);
                router.push("/outbound/list");
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
            {/* <!-- Thông tin xuất hàng --> */}
            <div className="w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Thông tin xuất hàng</h3>
                </div>
                <div className="p-6.5">
                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
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

                        <div className="w-full xl:w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Ngày xuất
                            </label>
                            <DatePickerOne dateValue={watch("createdDate")} disabled={true} />
                        </div>
                    </div>

                    {outboundType === "CHUYEN_KHO_NOI_BO" && (
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Xuất hàng cho <span className="text-meta-1">*</span>
                                </label>
                                <SelectGroupTwo
                                    register={{ ...register("toBranch.id") }}
                                    watch={watch("toBranch.id")}
                                    icon={<AiOutlineShop />}
                                    placeholder="Chọn chi nhánh xuất"
                                    disabled={
                                        viewMode === "details" ||
                                        !["CHUA_LUU", "BAN_NHAP"].includes(outboundStatus as string)
                                    }
                                    data={branches.map((branch: Branch) => ({
                                        label: branch.branchName,
                                        value: branch.id,
                                    }))}
                                />
                                {errors.toBranch?.id && (
                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                        {errors.toBranch.id.message}
                                    </span>
                                )}
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Địa chỉ xuất hàng <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    defaultValue={selectedToBranch?.location ? selectedToBranch?.location : ""}
                                    type="text"
                                    placeholder="Nhập địa chỉ xuất hàng"
                                    disabled
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    )}
                    {outboundType === "TRA_HANG" && (
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Xuất hàng cho <span className="text-meta-1">*</span>
                                </label>
                                <SelectGroupTwo
                                    register={{ ...register("supplier.id") }}
                                    watch={watch("supplier.id")}
                                    icon={<TfiSupport />}
                                    placeholder="Chọn nhà cung cấp"
                                    disabled={
                                        viewMode === "details" ||
                                        !["CHUA_LUU", "BAN_NHAP"].includes(outboundStatus as string)
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
                                    Địa chỉ xuất hàng <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    defaultValue={selectedSupplier?.address ? selectedSupplier?.address : ""}
                                    type="text"
                                    placeholder="Nhập địa chỉ xuất hàng"
                                    disabled
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    )}
                    {/* {outboundType === "BAN_HANG" && (
                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Xuất hàng cho <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập nơi xuất hàng"
                                    disabled={viewMode === "details"}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>

                            <div className="w-full xl:w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Địa chỉ xuất hàng <span className="text-meta-1">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập địa chỉ xuất hàng"
                                    disabled={viewMode === "details"}
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    )} */}

                    <div className="mb-4.5 flex flex-row gap-6">
                        <div className="w-1/2">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                Lí do xuất hàng
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập lí do xuất hàng"
                                disabled={
                                    viewMode === "details" ||
                                    ["CHO_DUYET", "KIEM_HANG", "HOAN_THANH"].includes(outboundStatus as string)
                                }
                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="w-1/2">
                            <label className="mb-3 mr-3 inline-flex text-sm font-medium text-black dark:text-white">
                                Trạng thái đơn:
                            </label>
                            {renderOutboundStatus(outboundStatus)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Danh sách sản phẩm</h3>
                </div>
                <div className="p-6.5">
                    {viewMode !== "details" && ["CHUA_LUU", "BAN_NHAP"].includes(outboundStatus as string) && (
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
                                        targetUnit: {
                                            id: undefined,
                                        },
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
                    <ProductsTableOutbound
                        data={products || []}
                        active={viewMode !== "details" && ["BAN_NHAP", "CHUA_LUU"].includes(outboundStatus as string)}
                        errors={errors}
                        outboundType={outboundType}
                        setProducts={setValue}
                    />

                    {viewMode === "details" &&
                        ["BAN_NHAP"].includes(outboundStatus as string) &&
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
                        ["CHO_DUYET", "BAN_NHAP"].includes(outboundStatus as string) &&
                        (userInfo?.roles[0].type === "ADMIN" || userInfo?.roles[0].type === "MANAGER") && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                    onClick={(e) => handleChangeStatus(e, "KIEM_HANG")}
                                >
                                    Duyệt Đơn
                                </button>
                            </div>
                        )}

                    {viewMode === "details" && ["KIEM_HANG"].includes(outboundStatus as string) && (
                        <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                            <button
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                type="submit"
                                onClick={(e) => handleSubmitOutbound(e)}
                            >
                                Xuất hàng
                            </button>
                        </div>
                    )}

                    {viewMode === "create" && outboundType !== "BAN_HANG" && (
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

                    {viewMode === "create" && outboundType === "BAN_HANG" && (
                        <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                            <button
                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                type="submit"
                                onClick={() => console.log(errors)}
                            >
                                Tạo đơn
                            </button>
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
                                <p>Vui lòng chọn kiểu xuất hàng</p>
                                <Select
                                    value={outboundType}
                                    onChange={(e) =>
                                        setOutboundType(
                                            e.target.value as "HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO"
                                        )
                                    }
                                    label="Chọn kiểu xuất hàng"
                                    className="max-w-full"
                                >
                                    <SelectItem key={"CHUYEN_KHO_NOI_BO"}>Chuyển kho nội bộ</SelectItem>
                                    <SelectItem key={"HUY_HANG"}>Hủy hàng</SelectItem>
                                    <SelectItem key={"TRA_HANG"}>Trả hàng</SelectItem>
                                    <SelectItem key={"BAN_HANG"}>Bán hàng</SelectItem>
                                </Select>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        toast.error("Khởi tạo đơn xuất hàng thất bại");
                                        router.push(`/inbound/list`)
                                    }}
                                >
                                    Không
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={async () => {
                                        await initOutbound();
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

export default OutboundForm;

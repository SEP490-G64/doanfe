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

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import IconButton from "@/components/UI/IconButton";
import Loader from "@/components/common/Loader";
import { ProductInfor } from "@/types/inbound";
import { useAppContext } from "../AppProvider/AppProvider";
import { TokenDecoded } from "@/types/tokenDecoded";
import { OutboundBody, OutboundBodyType } from "@/lib/schemaValidate/outboundSchema";
import { getAllSupplier } from "@/services/supplierServices";
import { getAllBranch } from "@/services/branchServices";
import { Branch } from "@/types/branch";
import { getAllowedProducts, getProductBySupplierId } from "@/services/productServices";
import { Supplier } from "@/types/supplier";
import {
    changeInboundStatus,
    createInitOutbound,
    getOutboundById,
    submitDraft,
    submitInbound,
} from "@/services/outboundServices";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import { TfiSupport } from "react-icons/tfi";
import ProductsTableAfterCheck from "../Tables/ProductsTableAfterCheck";

const OutboundForm = ({ viewMode, outboundId }: { viewMode: "details" | "update" | "create"; outboundId?: string }) => {
    const [loading, setLoading] = useState(false);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [user, setUser] = useState<{ firstName: string; lastName: string } | undefined>();
    const [branch, setBranch] = useState<{ id: number; branchName: string } | undefined>();
    const [outboundStatus, setInboundStatus] = useState<string | undefined>();
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [productOpts, setProductOpts] = useState<ProductInfor[]>([]);
    const { isOpen, onOpenChange } = useDisclosure();
    const [outboundType, setOutboundType] = useState<"HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO">(
        "CHUYEN_KHO_NOI_BO"
    );
    const [product, setProduct] = useState<ProductInfor>();

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
            supplier: { id: "" },
            fromBranch: { id: "" },
            toBranch: undefined,
            outboundProductDetails: [],
        },
    });

    const products = watch("outboundProductDetails");
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
        setValue("outboundProductDetails", [...products, { ...product, baseUnit: { id: 1, unitName: "viên" } }]);
    };

    const initOutbound = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await createInitOutbound(outboundType, sessionToken);

            if (response.status === "SUCCESS") {
                setValue("outboundId", response.data.id);
                setValue("outboundCode", response.data.outboundCode);
                setValue("outboundType", response.data.outboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("toBranch.id", response.data.toBranch.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy.id);
                setUser(response.data.createdBy);
                setBranch(response.data.toBranch);
                setInboundStatus(response.data.status);
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
            const response = await getOutboundById(outboundId as string, sessionToken);

            if (response.message === "200 OK") {
                setValue("outboundId", response.data.id);
                setValue("outboundCode", response.data.outboundCode);
                setValue("outboundType", response.data.outboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("toBranch.id", response.data.toBranch.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy?.id);
                setValue("supplier.id", response.data.supplier.id);
                setValue("outboundProductDetails", response.data.productBatchDetails);
                setUser(response.data.createdBy);
                setBranch(response.data.toBranch);
                setInboundStatus(response.data.status);
                setOutboundType(response.data.outboundType);
                setSelectedSupplier(response.data.supplier);
                setSelectedFromBranch(response.data.fromBranch);
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

    const getBranchOpts = async () => {
        try {
            const response = await getAllBranch(sessionToken);

            if (response.message === "200 OK") {
                setBranches(response.data.filter((b: Branch) => b.id !== branch?.id));
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
            if (outboundType === "TRA_HANG")
                response = await getProductBySupplierId(selectedSupId.toString(), inputString, sessionToken);
            else response = await getAllowedProducts(inputString, sessionToken);
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
            getInforInbound();
        }
        getSupplierOpts();
        getBranchOpts();
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
        const response = await changeInboundStatus(outboundId as string, status, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/outbound/list");
            router.refresh();
        }
    };

    const handleSubmitInbound = async (e: React.MouseEvent) => {
        e.preventDefault();
        const response = await submitInbound(outboundId as string, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/outbound/list");
            router.refresh();
            await changeInboundStatus(outboundId as string, "HOAN_THANH", sessionToken);
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
            delete outbound.fromBranch;
            const response = await submitDraft(outbound, sessionToken);

            if (response && response.status === "SUCCESS") {
                router.push("/outbound/list");
                router.refresh();
                if (outboundStatus === "KIEM_HANG")
                    await changeInboundStatus(outboundId as string, "KIEM_HANG", sessionToken);
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
                                disabled={viewMode === "details"}
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
                                    icon={<TfiSupport />}
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
                                    defaultValue={selectedFromBranch?.location ? selectedFromBranch?.location : ""}
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
                    {outboundType === "BAN_HANG" && (
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
                    )}

                    <div className="mb-4.5">
                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                            Lí do xuất hàng
                        </label>
                        <input
                            type="text"
                            placeholder="Nhập lí do xuất hàng"
                            disabled={viewMode === "details"}
                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />
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
                    <ProductsTableAfterCheck
                        data={
                            products.map((p) =>
                                !p.batches || p.batches.length === 0
                                    ? {
                                          ...p,
                                          batches: [
                                              {
                                                  batchCode: undefined,
                                                  inboundBatchQuantity: 1,
                                                  inboundPrice: 1,
                                                  expireDate: undefined,
                                              },
                                          ],
                                      }
                                    : p
                            ) || []
                        }
                        active={outboundStatus === "KIEM_HANG"}
                        errors={errors}
                        setProducts={setValue}
                    />

                    {viewMode !== "details" && (
                        <button
                            className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                            type="submit"
                        >
                            {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
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
                                <p>Vui lòng chọn kiểu xuât hàng</p>
                                <Select
                                    value={outboundType}
                                    onChange={(e) =>
                                        setOutboundType(
                                            e.target.value as "HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO"
                                        )
                                    }
                                    label="Chọn kiểu xuât hàng"
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
                                        toast.error("Khởi tạo đơn xuât hàng thất bại");
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

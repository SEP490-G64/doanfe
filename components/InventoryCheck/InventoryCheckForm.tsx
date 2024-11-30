"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import ReactSelect from "react-select";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { FaPlus } from "react-icons/fa";

import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import Loader from "@/components/common/Loader";
import {
    changeInventoryCheckStatus,
    createInitInventoryCheck,
    getInventoryCheckById,
    submitDraft,
    submitInventoryCheck,
} from "@/services/inventoryCheckServices";
import { CheckBody, CheckBodyType, ProductCheckType } from "@/lib/schemaValidate/inventoryCheckSchema";
import {
    getProductByBranchId,
    getProductInventoryCheck,
    getProductInventoryCheckByCate,
    getProductInventoryCheckByType,
} from "@/services/productServices";
import { TokenDecoded } from "@/types/tokenDecoded";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import ProductsTableInventoryCheckTwo from "../Tables/ProductsTableInventoryCheckTwo";
import { getAllCategory } from "@/services/categoryServices";
import { getAllType } from "@/services/typeServices";
import { Category } from "@/types/category";
import { Type } from "@/types/type";
import IconButton from "../UI/IconButton";
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
    const [productOpts, setProductOpts] = useState<ProductCheckType[]>([]);
    const { isOpen, onOpenChange } = useDisclosure();
    const [product, setProduct] = useState();
    const [saveDraft, setSaveDraft] = useState(false);
    const [inventoryCheckType, setInventoryCheckType] = useState<
        "KIEM_KHO_DINH_KY" | "KIEM_KHO_DOT_XUAT" | "KIEM_KHO_VAT_LY_TOAN_PHAN" | "KIEM_KHO_TRONG_TAM"
    >();
    const [cateOpts, setCateOpts] = useState([]);
    const [cateId, setCateId] = useState<string>();
    const [typeOpts, setTypeOpts] = useState([]);
    const [typeId, setTypeId] = useState<string>();

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
            case "DANG_KIEM":
                return (
                    <p
                        className={
                            "inline-flex rounded-full bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary"
                        }
                    >
                        Đang kiểm
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
                getProductOptsTwo(inputValue);
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

                if (inventoryCheckType !== "KIEM_KHO_DOT_XUAT") await getProductOpts(response.data.branch.id);
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
                setValue("code", response.data.code);
                setValue("createdDate", response.data.createdDate);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy?.id);
                setValue("inventoryCheckProductDetails", response.data.inventoryCheckProductDetails);
                setUser(response.data.createdBy);
                setBranch(response.data.branch);
                setInventoryCheckStatus(response.data.status);
                setProductOpts(response.data.inventoryCheckProductDetails);
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getProductOpts = async (branchId: string, categoryId?: string, typeId?: string) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            let response;
            if (inventoryCheckType === "KIEM_KHO_VAT_LY_TOAN_PHAN")
                response = await getProductInventoryCheckByCate(branchId, sessionToken, categoryId);
            else if (inventoryCheckType === "KIEM_KHO_TRONG_TAM")
                response = await getProductInventoryCheckByType(branchId, sessionToken, typeId as string);
            else response = await getProductInventoryCheck(branchId, sessionToken);
            if (response.message === "200 OK") {
                setProductOpts(response.data);
                if (inventoryCheckType !== "KIEM_KHO_DOT_XUAT") setValue("inventoryCheckProductDetails", response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetchingProduct(false);
        }
    };

    const getProductOptsTwo = async (inputString: string) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            const response = await getProductByBranchId(branch!.id.toString(), inputString, false, sessionToken);
            if (response.message === "200 OK") {
                setProductOpts(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetchingProduct(false);
        }
    };

    const getDataOptions = async () => {
        try {
            const response = await Promise.all([getAllCategory(sessionToken), getAllType(sessionToken)]);

            if (response) {
                setCateOpts(response[0].data.map((c: Category) => ({ value: c.id, label: c.categoryName })));
                setTypeOpts(response[1].data.map((t: Type) => ({ value: t.id, label: t.typeName })));
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDataOptions();
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
            await changeInventoryCheckStatus(inventoryCheckId as string, "DA_CAN_BANG", sessionToken);
        }
    };

    const onSubmit = async (inventoryCheck: CheckBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        console.log(inventoryCheck);
        if (
            !saveDraft &&
            inventoryCheck.inventoryCheckProductDetails.some(
                (product) => product.difference === undefined || product.countedQuantity === undefined
            )
        ) {
            toast.error("Vui lòng nhập số lượng kiểm của tất cả sản phẩm");
            return;
        }

        inventoryCheck.inventoryCheckProductDetails.forEach((product) => {
            if (product.batch?.batchCode === undefined) {
                delete product.batch;
            }
        });

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

                    <div className="mb-4.5 flex gap-6">
                        {inventoryCheckType === "KIEM_KHO_VAT_LY_TOAN_PHAN" && (
                            <div className="relative z-20 w-1/2 shrink-0">
                                <select
                                    value={cateId || ""}
                                    onChange={async (e) => {
                                        setCateId(e.target.value);
                                        await getProductOpts(branch!.id.toString(), e.target.value);
                                    }}
                                    className={`size-full min-w-[40px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition ${cateId ? "text-black dark:text-white" : "text-gray-500"} focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                                >
                                    <option value="" className="text-gray-500">
                                        Vui lòng chọn nhóm sản phẩm
                                    </option>

                                    {cateOpts.map((opt: { value: string; label: string }) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                            className="text-black dark:text-white"
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2">
                                    <svg
                                        className="text-gray-500 fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"></path>
                                    </svg>
                                </span>
                            </div>
                        )}
                        {inventoryCheckType === "KIEM_KHO_TRONG_TAM" && (
                            <div className="relative z-20 w-1/2 shrink-0">
                                <select
                                    value={typeId || ""}
                                    onChange={async (e) => {
                                        setTypeId(e.target.value);
                                        await getProductOpts(branch!.id.toString(), undefined, e.target.value);
                                    }}
                                    className={`size-full min-w-[40px] appearance-none rounded border border-strokedark bg-transparent px-3 py-2 outline-none transition ${typeId ? "text-black dark:text-white" : "text-gray-500"} focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`}
                                >
                                    <option value="" className="text-gray-500">
                                        Vui lòng chọn loại sản phẩm
                                    </option>

                                    {typeOpts.map((opt: { value: string; label: string }) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                            className="text-black dark:text-white"
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                <span className="absolute right-2 top-1/2 z-30 -translate-y-1/2">
                                    <svg
                                        className="text-gray-500 fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"></path>
                                    </svg>
                                </span>
                            </div>
                        )}
                        <div className="items-center">
                            <label className="mb-3 mr-3 inline-flex text-sm font-medium text-black dark:text-white">
                                Trạng thái đơn:
                            </label>
                            {renderInventoryCheckStatus(inventoryCheckStatus)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                    <h3 className="font-medium text-black dark:text-white">Danh sách sản phẩm</h3>
                </div>
                <div className="p-6.5">
                    {viewMode !== "details" && inventoryCheckType === "KIEM_KHO_DOT_XUAT" && (
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
                                        systemQuantity: option?.productQuantity,
                                        countedQuantity: 0,
                                        difference: 0,
                                        reason: undefined,
                                    });
                                }}
                                // onInputChange={handleTypeProduct}
                                onMenuOpen={async () => await getProductOptsTwo("")}
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

                    {inventoryCheckType === "KIEM_KHO_DOT_XUAT" ? (
                        <ProductsTableInventoryCheck
                            data={products || []}
                            active={
                                viewMode !== "details" &&
                                ["BAN_NHAP", "CHUA_LUU", "DANG_KIEM"].includes(inventoryCheckStatus as string)
                            }
                            errors={errors}
                            setProducts={setValue}
                        />
                    ) : (
                        <ProductsTableInventoryCheckTwo
                            data={productOpts || []}
                            active={
                                viewMode !== "details" &&
                                ["BAN_NHAP", "CHUA_LUU", "DANG_KIEM"].includes(inventoryCheckStatus as string)
                            }
                            startedDate={watch("createdDate")}
                            sessionToken={sessionToken}
                            setProducts={setValue}
                        />
                    )}

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
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={(e) => handleSubmitInventoryCheck(e)}
                                    >
                                        Duyệt Đơn
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        onClick={(e) => handleChangeStatus(e, "DANG_KIEM")}
                                    >
                                        Từ chối duyệt
                                    </button>
                                </div>
                            </div>
                        )}

                    {viewMode !== "details" &&
                        ["BAN_NHAP", "DANG_KIEM", "CHUA_LUU"].includes(inventoryCheckStatus as string) && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => console.log(errors)}
                                    >
                                        {viewMode === "create" ? "Tạo và gửi đơn" : "Gửi đơn"}
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
                                <p>Vui lòng chọn kiểu kiểm hàng</p>
                                <Select
                                    value={inventoryCheckType}
                                    onChange={(e) =>
                                        setInventoryCheckType(
                                            e.target.value as
                                                | "KIEM_KHO_DINH_KY"
                                                | "KIEM_KHO_DOT_XUAT"
                                                | "KIEM_KHO_VAT_LY_TOAN_PHAN"
                                                | "KIEM_KHO_TRONG_TAM"
                                        )
                                    }
                                    label="Chọn kiểu kiểm hàng"
                                    className="max-w-full"
                                >
                                    <SelectItem key={"KIEM_KHO_DINH_KY"}>Kiểm kho định kỳ</SelectItem>
                                    <SelectItem key={"KIEM_KHO_DOT_XUAT"}>Kiểm kho đột xuất</SelectItem>
                                    <SelectItem key={"KIEM_KHO_VAT_LY_TOAN_PHAN"}>
                                        Kiểm kho theo nhóm sản phẩm
                                    </SelectItem>
                                    <SelectItem key={"KIEM_KHO_TRONG_TAM"}>Kiểm kho theo loại sản phẩm</SelectItem>
                                </Select>
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

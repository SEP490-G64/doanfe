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
import { FaFileImport, FaPlus } from "react-icons/fa6";
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
import { getStaffBranches } from "@/services/branchServices";
import { Branch } from "@/types/branch";
import { getProductByBranchId } from "@/services/productServices";
import { Supplier } from "@/types/supplier";
import {
    approveOutbound,
    changeOutboundStatus,
    createInitOutbound,
    getOutboundById,
    submitDraft,
    submitDraftForSell,
    submitOutbound,
} from "@/services/outboundServices";
import SelectGroupTwo from "../SelectGroup/SelectGroupTwo";
import ProductsTableOutbound from "../Tables/ProductTableOutbound";
import { exportOutbound } from "@/services/outboundServices";
import HeaderTaskbar from "../HeaderTaskbar/GoBackHeaderTaskbar/page";

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
    const { isOpen, onOpenChange, onOpen } = useDisclosure();
    const [outboundType, setOutboundType] = useState<"HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO">();
    const [product, setProduct] = useState<ProductInfor>();
    const [action, setAction] = useState<string>("");
    const [approver, setApprover] = useState<{ firstName: string; lastName: string } | undefined>();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [approve, setIsApprove] = useState<boolean | undefined>();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [taxable, setTaxable] = useState<boolean | undefined>();

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
            fromBranch: {
                id: userInfo?.branch?.id ? Number(userInfo?.branch?.id) : undefined,
            },
            toBranch: undefined,
            approvedBy: undefined,
            isApproved: false,
            taxable: false,
            outboundProductDetails: [],
            totalPrice: undefined,
        },
    });

    // Hàm để nhận giá trị totalPrice từ ProductsTableAfterCheck
    const handleTotalPriceChange = (newTotalPrice: number) => {
        setTotalPrice(newTotalPrice); // Cập nhật giá trị totalPrice
    };

    const products = watch("outboundProductDetails");
    const selectedSupId = watch("supplier.id");
    const selectedToBranchId = watch("toBranch.id");
    const selectedFromBranchId = watch("fromBranch.id");

    const handleOpenModal = (action: string) => {
        setAction(action);
        if (action !== "") {
            onOpen();
        }
    };

    // Debounced fetch options
    const debouncedFetchOptions = debounce((inputValue: string) => {
        if (inputValue) {
            getProductOpts(inputValue);
        } else {
            setProductOpts([]);
        }
    }, 500);

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
                setIsApprove(response.data.isApproved);
                setTaxable(response.data.taxable);

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
            // Ưu tiên gọi getBranchOpts
            const fetchBranchOpts = async () => {
                const response = await getOutboundById(outboundId as string, sessionToken);

                if (response.message === "200 OK") {
                    if (response.data.outboundType === "CHUYEN_KHO_NOI_BO") {
                        await getBranchOpts(response.data.fromBranch?.id); // Ưu tiên chạy
                    }
                    return response.data;
                } else {
                    router.push("/not-found");
                    return null;
                }
            };

            const outboundData = await fetchBranchOpts();

            if (!outboundData) return;

            // Set giá trị sau khi gọi xong getBranchOpts
            setValue("outboundId", outboundData.id);
            setValue("outboundCode", outboundData.outboundCode);
            setValue("outboundType", outboundData.outboundType);
            setValue("createdDate", outboundData.createdDate);
            setValue("toBranch.id", outboundData.toBranch?.id);
            setValue("fromBranch.id", outboundData.fromBranch?.id);
            setValue("note", outboundData.note);
            setValue("createdBy.id", outboundData.createdBy?.id);
            setValue("supplier.id", outboundData.supplier?.id);
            setValue("outboundProductDetails", outboundData.outboundProductDetails);
            setValue("approvedBy.id", outboundData.approvedBy?.id);
            setValue("isApproved", outboundData.isApproved);
            setValue("taxable", outboundData.taxable);
            setUser(outboundData.createdBy);
            setBranch(outboundData.fromBranch);
            setOutboundStatus(outboundData.status);
            setOutboundType(outboundData.outboundType);
            setSelectedSupplier(outboundData.supplier);
            setSelectedToBranch(outboundData.toBranch);
            setApprover(outboundData.approvedBy);
            setIsApprove(outboundData.isApproved);
            setTaxable(outboundData.taxable);
        } catch (error) {
            console.error(error);
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
            const response = await getStaffBranches(sessionToken);

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
            if (outboundType === "TRA_HANG" || outboundType === "HUY_HANG")
                response = await getProductByBranchId(branch!.id.toString(), inputString, false, sessionToken);
            else if (outboundType === "BAN_HANG")
                response = await getProductByBranchId(
                    branch!.id.toString(),
                    inputString,
                    true,
                    sessionToken,
                    undefined,
                    true
                );
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
        const fetchData = async () => {
            await getSupplierOpts();
            if (viewMode === "create") {
                onOpenChange();
            } else {
                await getInforOutbound();
            }
        };

        fetchData();
    }, []);

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
    const [selectedToBranch, setSelectedToBranch] = useState<Branch | undefined>();

    useEffect(() => {
        if (selectedSupId) {
            const sup = suppliers.find((item: Supplier) => item.id == selectedSupId);
            setSelectedSupplier(sup);
        }
    }, [selectedSupId]);

    useEffect(() => {
        if (selectedToBranchId) {
            const branch = branches.find((item: Branch) => item.id == selectedToBranchId);
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

    const onSubmit = async (outbound: OutboundBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        outbound.totalPrice = totalPrice?.toString() || "0";
        console.log(outbound);
        setLoading(true);
        try {
            if (outboundType === "CHUYEN_KHO_NOI_BO") delete outbound.supplier;
            else if (outboundType === "TRA_HANG") delete outbound.toBranch;
            else {
                delete outbound.supplier;
                delete outbound.toBranch;
            }
            // Nếu là KIEM_HANG, thực hiện ngay API submitOutbound và dừng
            if (outboundStatus === "KIEM_HANG") {
                const response = await submitOutbound(outbound, sessionToken);
                if (response?.status === "SUCCESS") {
                    if (action === "HOAN_THANH") {
                        handleOpenModal(action);
                        return;
                    }
                    toast.success("Lưu đơn và xuất hàng thành công!");
                    router.push("/outbound/list");
                    router.refresh();
                } else {
                    toast.error(response?.message || "Đã xảy ra lỗi khi xử lý kiểm hàng!");
                }
                return; // Ngừng thực thi đoạn mã tiếp theo
            }

            // Tiếp tục nếu không phải KIEM_HANG
            let response;
            if (outboundType !== "BAN_HANG") response = await submitDraft(outbound, sessionToken);
            else {
                if (products.length === 0) {
                    toast.error("Vui lòng thêm sản phẩm vào danh sách trước khi xác nhận bán");
                    return;
                }
                response = await submitDraftForSell(outbound, sessionToken);
            }

            if (response?.status === "SUCCESS") {
                if (outboundType !== "BAN_HANG")
                    await changeOutboundStatus(watch("outboundId")!.toString(), "BAN_NHAP", sessionToken);
                else await changeOutboundStatus(watch("outboundId")!.toString(), "HOAN_THANH", sessionToken);

                if (action === "CHO_DUYET") {
                    handleOpenModal(action);
                    return;
                }

                toast.success("Lưu đơn và xuất hàng thành công!");
                router.push("/outbound/list");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (id: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);

        try {
            const res = await exportOutbound(id, sessionToken);

            if (res && res instanceof Blob) {
                // Tạo URL tạm thời từ Blob để preview
                const url = window.URL.createObjectURL(res);

                // Mở modal và hiển thị preview
                setPreviewUrl(url);
                handleOpenModal("EXPORT");

                toast.success("Xem trước phiếu xuất hàng thành công");
            } else {
                toast.error("Dữ liệu không hợp lệ");
            }
        } catch (error) {
            toast.error("Xem trước phiếu xuất hàng thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (previewUrl) {
            const link = document.createElement("a");
            link.href = previewUrl;
            link.setAttribute("download", "outbound-" + watch("outboundCode") + ".pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Xuất phiếu xuất hàng thành công");
        }
    };

    const handleApprove = async (accept: boolean) => {
        const response = await approveOutbound(outboundId as string, accept, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/outbound/list");
            router.refresh();
        }
    };

    const handleAction = async (action: string) => {
        try {
            let res;
            switch (action) {
                case "CHO_DUYET":
                    if (products.length === 0) {
                        toast.error("Vui lòng thêm sản phẩm vào danh sách trước khi yêu cầu duyệt đơn");
                        return;
                    }
                    res = await changeOutboundStatus(watch("outboundId")!.toString(), "CHO_DUYET", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Gửi yêu cầu duyệt đơn thành công!");
                    }
                    router.push(`/outbound/list`);
                    break;
                case "BỎ_DUYỆT":
                    res = await changeOutboundStatus(watch("outboundId")!.toString(), "BAN_NHAP", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Hủy yêu cầu duyệt đơn thành công!");
                    }
                    router.push(`/outbound/update/` + watch("outboundId"));
                    break;
                case "DUYỆT":
                    await handleApprove(true);
                    break;
                case "TỪ_CHỐI":
                    await handleApprove(false);
                    break;
                case "KIỂM":
                    res = await changeOutboundStatus(watch("outboundId")!.toString(), "KIEM_HANG", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Chuyển đơn xuất hàng sang trạng thái kiểm hàng thành công!");
                    }
                    router.push(`/outbound/update/` + watch("outboundId"));
                    break;
                case "HOAN_THANH":
                    res = await changeOutboundStatus(watch("outboundId")!.toString(), "HOAN_THANH", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Lưu đơn, xuất hàng và xác nhận đơn hoàn thành thành công!");
                    }
                    router.push(`/outbound/list`);
                    break;
                case "EXPORT":
                    handleDownload();
                    break;
                default:
                    await initOutbound();
                    break;
            }
            setAction("");
        } catch (error) {
            console.error("Error handling action:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
        }
    };

    if (loading) return <Loader />;
    return (
        <>
            <HeaderTaskbar />
            <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* <!--  Thông tin người duyệt --> */}
                {viewMode !== "create" && outboundType != "BAN_HANG" && (
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="p-6.5">
                            <div className="flex flex-col gap-6 xl:flex-row">
                                <div className="flex w-full items-center gap-2 xl:w-1/2">
                                    <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                        Người duyệt:
                                    </label>
                                    <input
                                        defaultValue={approver ? `${approver?.firstName} ${approver?.lastName}` : ""}
                                        type="text"
                                        placeholder="Chưa được duyệt"
                                        disabled
                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="flex w-full items-center justify-center gap-2 xl:w-1/3">
                                    <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                        Trạng thái duyệt:
                                    </label>
                                    {(() => {
                                        switch (approve) {
                                            case false:
                                                return (
                                                    <p className="text-nowrap rounded bg-danger/10 px-3 py-1 text-sm font-medium text-danger">
                                                        Đơn bị từ chối
                                                    </p>
                                                );
                                            case true:
                                                return (
                                                    <p className="text-nowrap rounded bg-success/10 px-3 py-1 text-sm font-medium text-success">
                                                        Đơn đã được duyệt
                                                    </p>
                                                );
                                            default:
                                                return (
                                                    <p className="text-nowrap rounded bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
                                                        Đơn chưa được duyệt
                                                    </p>
                                                );
                                        }
                                    })()}
                                </div>

                                <div className="flex w-full items-center gap-2 xl:w-1/6">
                                    {outboundStatus === "HOAN_THANH" && (
                                        <Button
                                            icon={<FaFileImport />}
                                            className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                                            onClick={() => handleExport(outboundId as string)}
                                        >
                                            Xuất file
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                                        placeholder="Chọn chi nhánh nhận hàng"
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
                                        Địa chỉ xuất hàng đến <span className="text-meta-1">*</span>
                                    </label>
                                    <input
                                        defaultValue={selectedToBranch?.location ? selectedToBranch?.location : ""}
                                        type="text"
                                        placeholder="Nhập địa chỉ xuất hàng đến"
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
                        <div className="mb-4.5 flex flex-row gap-6">
                            <div className="w-1/2">
                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                    Lí do xuất hàng
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập lí do xuất hàng"
                                    {...register("note")}
                                    disabled={
                                        viewMode === "details" ||
                                        ["CHO_DUYET", "KIEM_HANG", "HOAN_THANH"].includes(outboundStatus as string)
                                    }
                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="w-1/2">
                                {/* Dòng đầu tiên */}
                                <div className="mb-4 flex items-center">
                                    <label className="mr-3 text-sm font-medium text-black dark:text-white">
                                        Có tính thuế nhập hàng:{" "}
                                    </label>
                                    <input
                                        type="checkbox"
                                        {...register("taxable")} // Kế thừa đăng ký từ React Hook Form
                                        checked={outboundStatus === "KIEM_HANG" ? taxable : watch("taxable")} // Đồng bộ hóa với giá trị từ React Hook Form
                                        onChange={(e) => {setValue("taxable", e.target.checked);
                                            setTaxable(taxable);}} // Cập nhật giá trị
                                        disabled={viewMode === "details" || outboundStatus === "KIEM_HANG"} // Vô hiệu hóa theo điều kiện
                                        className="border-gray-300 rounded text-primary focus:ring-primary disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* Dòng thứ hai */}
                                <div className="flex items-center">
                                    <label className="mr-3 text-sm font-medium text-black dark:text-white">
                                        Trạng thái đơn:
                                    </label>
                                    {renderOutboundStatus(outboundStatus)}
                                </div>
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
                                    // onInputChange={handleTypeProduct}
                                    options={productOpts.map((option) => ({
                                        value: option.registrationCode,
                                        label: option.productName,
                                    }))}
                                    onMenuOpen={async () => await getProductOpts("")}
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
                                <IconButton
                                    icon={<FaPlus />}
                                    onClick={(e) => {
                                        e!.preventDefault();
                                        if (!product) {
                                            // Nếu không có sản phẩm, thông báo lỗi
                                            toast.error("Vui lòng chọn sản phẩm trước khi thêm.");
                                            return;
                                        }
                                        addItem(e);
                                    }}
                                />
                            </div>
                        )}
                        <ProductsTableOutbound
                            data={products || []}
                            active={
                                viewMode !== "details" &&
                                ["BAN_NHAP", "CHUA_LUU", "KIEM_HANG"].includes(outboundStatus as string)
                            }
                            errors={errors.outboundProductDetails || []} // Truyền lỗi vào đây
                            outboundType={outboundType}
                            setProducts={setValue}
                            outboundStatus={outboundStatus}
                            taxable={outboundStatus === "KIEM_HANG" ? taxable : watch("taxable")}
                            totalPrice={watch("totalPrice")}
                            onTotalPriceChange={handleTotalPriceChange}
                        />

                        {viewMode === "details" &&
                            ["CHO_DUYET"].includes(outboundStatus as string) &&
                            userInfo?.roles[0].type === "STAFF" &&
                            ["CHO_DUYET"].includes(outboundStatus as string) && (
                                <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                    <div className="w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            onClick={() => handleOpenModal("BỎ_DUYỆT")}
                                            type={"button"}
                                        >
                                            Hủy yêu cầu chờ duyệt
                                        </button>
                                    </div>
                                    <div className="w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                            onClick={() => router.push(`/outbound/list`)}
                                            type={"button"}
                                        >
                                            Quay lại danh sách
                                        </button>
                                    </div>
                                </div>
                            )}

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
                            (userInfo?.roles[0].type === "ADMIN" || userInfo?.roles[0].type === "MANAGER") &&
                            ["CHO_DUYET"].includes(outboundStatus as string) && (
                                <>
                                    <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                        <div className="w-1/2">
                                            <button
                                                className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                                type="button"
                                                onClick={() => handleOpenModal("DUYỆT")}
                                            >
                                                Duyệt Đơn
                                            </button>
                                        </div>
                                        <div className="w-1/2">
                                            <button
                                                className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                                type="button"
                                                onClick={() => handleOpenModal("TỪ_CHỐI")}
                                            >
                                                Từ chối Đơn
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                        {viewMode === "update" && ["KIEM_HANG"].includes(outboundStatus as string) && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => {
                                            setValue("status", "KIEM_HANG");
                                            setAction("HOAN_THANH");
                                            console.log(errors);
                                        }}
                                    >
                                        Cập nhật, xuất hàng và xác nhận đơn hoàn thành
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        type="submit"
                                        onClick={setValue("status", "KIEM_HANG")}
                                    >
                                        Cập nhật và xuất hàng
                                    </button>
                                </div>
                            </div>
                        )}

                        {viewMode === "create" && outboundType !== "BAN_HANG" && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => {
                                            setAction("CHO_DUYET");
                                            console.log(errors);
                                        }}
                                    >
                                        Tạo và gửi yêu cầu duyệt
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        type="submit"
                                        onClick={() => {
                                            setAction("BAN_NHAP");
                                            console.log(errors);
                                        }}
                                    >
                                        Lưu đơn
                                    </button>
                                </div>
                            </div>
                        )}

                        {viewMode === "update" && ["CHUA_LUU", "BAN_NHAP"].includes(outboundStatus as string) && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => {
                                            setAction("CHO_DUYET");
                                            console.log(errors);
                                        }}
                                    >
                                        Cập nhật và gửi yêu cầu duyệt
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        type="submit"
                                        onClick={() => {
                                            setAction("BAN_NHAP");
                                            console.log(errors);
                                        }}
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        )}

                        {viewMode === "create" && outboundType === "BAN_HANG" && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                    onClick={() => {
                                        console.log(errors);
                                    }}
                                >
                                    Tạo đơn
                                </button>
                            </div>
                        )}

                        {viewMode === "details" && outboundStatus === "KIEM_HANG" && (
                            <button
                                className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                type="submit"
                                onClick={() => {
                                    handleOpenModal("HOAN_THANH");
                                    console.log(errors);
                                }}
                            >
                                Xuất hàng
                            </button>
                        )}
                    </div>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                <ModalBody>
                                    {(() => {
                                        switch (action) {
                                            case "CHO_DUYET":
                                                return <p>Bạn có chắc muốn gửi yêu cầu duyệt?</p>;
                                            case "BỎ_DUYỆT":
                                                return <p>Bạn có chắc muốn hủy yêu cầu duyệt đơn?</p>;
                                            case "DUYỆT":
                                                return <p>Bạn có chắc muốn duyệt đơn này?</p>;
                                            case "TỪ_CHỐI":
                                                return <p>Bạn có chắc muốn từ chối đơn này?</p>;
                                            case "KIỂM":
                                                return <p>Bạn có chắc hàng đã về để kiểm đơn này?</p>;
                                            case "HOAN_THANH":
                                                return (
                                                    <>
                                                        <p>Bạn có muốn đánh dấu đơn này hoàn thành không?</p>
                                                        <p>
                                                            <i style={{ color: "red" }}>
                                                                Lưu ý: Nếu xác nhận hoàn thành đơn hàng, bạn không thể
                                                                quay lại chỉnh sửa được nữa.
                                                            </i>
                                                        </p>
                                                    </>
                                                );
                                            case "EXPORT":
                                                return (
                                                    <iframe
                                                        src={previewUrl}
                                                        width="100%"
                                                        height="500px"
                                                        title="Preview PDF"
                                                    ></iframe>
                                                );
                                            default:
                                                return (
                                                    <>
                                                        <p>Vui lòng chọn kiểu xuất hàng</p>
                                                        <Select
                                                            value={outboundType}
                                                            onChange={(e) =>
                                                                setOutboundType(
                                                                    e.target.value as
                                                                        | "HUY_HANG"
                                                                        | "TRA_HANG"
                                                                        | "BAN_HANG"
                                                                        | "CHUYEN_KHO_NOI_BO"
                                                                )
                                                            }
                                                            label="Chọn kiểu xuất hàng"
                                                            className="max-w-full"
                                                        >
                                                            <SelectItem key={"CHUYEN_KHO_NOI_BO"}>
                                                                Chuyển kho nội bộ
                                                            </SelectItem>
                                                            <SelectItem key={"HUY_HANG"}>Hủy hàng</SelectItem>
                                                            <SelectItem key={"TRA_HANG"}>Trả hàng</SelectItem>
                                                            <SelectItem key={"BAN_HANG"}>Bán hàng</SelectItem>
                                                        </Select>
                                                    </>
                                                );
                                        }
                                    })()}
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="default"
                                        variant="light"
                                        onPress={async () => {
                                            switch (action) {
                                                case "CHO_DUYET":
                                                    toast.warning("Hủy gửi yêu cầu duyệt đơn!");
                                                    break;
                                                case "BỎ_DUYỆT":
                                                    toast.warning("Bỏ hủy yêu cầu duyệt đơn!");
                                                    break;
                                                case "DUYỆT":
                                                    toast.warning("Bỏ duyệt đơn xuất hàng!");
                                                    break;
                                                case "TỪ_CHỐI":
                                                    toast.warning("Từ chối duyệt đơn xuất hàng!");
                                                    break;
                                                case "KIỂM":
                                                    toast.warning(
                                                        "Hủy chuyển đơn xuất hàng sang trạng thái kiểm hàng thành công!"
                                                    );
                                                    break;
                                                case "HOAN_THANH":
                                                    toast.warning(
                                                        "Lưu đơn, xuất hàng thành công nhưng xác nhận đơn hoàn thành thất bại!"
                                                    );
                                                    router.push(`/outbound/list`);
                                                    break;
                                                case "EXPORT":
                                                    toast.error("Hủy xuất phiếu!");
                                                    break;
                                                default:
                                                    toast.error("Khởi tạo đơn xuất hàng thất bại!");
                                                    router.push(`/outbound/list`);
                                                    break;
                                            }
                                            setAction("");
                                            onClose(); // Đóng modal
                                        }}
                                    >
                                        Không
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={async () => {
                                            await handleAction(action); // Xử lý logic chính
                                            setAction("");
                                            onClose(); // Đóng modal
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

export default OutboundForm;

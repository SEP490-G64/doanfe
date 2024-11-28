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
    SelectItem, Tooltip,
} from "@nextui-org/react";

import ReactSelect from "react-select";
import { debounce } from "lodash";
import { jwtDecode } from "jwt-decode";
import { FaFileImport, FaPencil, FaPlus } from "react-icons/fa6";
import { TfiSupport } from "react-icons/tfi";
import { AiOutlineShop } from "react-icons/ai";

import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import DatePickerOne from "@/components/FormElements/DatePicker/DatePickerOne";
import ProductsTableBeforeCheck from "@/components/Tables/ProductsTableBeforeCheck";
import IconButton from "@/components/UI/IconButton";
import {
    approveInbound,
    changeInboundStatus,
    createInitInbound,
    deleteInbound, exportInbound,
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
import { getProductByBranchId, searchAllProductsByKeyword } from "@/services/productServices";
import { ProductInfor } from "@/types/inbound";
import { getStaffBranches } from "@/services/branchServices";
import { Branch } from "@/types/branch";
import Unauthorized from "@/components/common/Unauthorized";

const InboundForm = ({ viewMode, inboundId }: { viewMode: "details" | "update" | "create"; inboundId?: string }) => {
    const [loading, setLoading] = useState(false);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const [action, setAction] = useState<string>("");
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const [user, setUser] = useState<{ firstName: string; lastName: string } | undefined>();
    const [approver, setApprover] = useState<{ firstName: string; lastName: string } | undefined>();
    const [branch, setBranch] = useState<{ id: number; branchName: string } | undefined>();
    const [inboundStatus, setInboundStatus] = useState<string | undefined>();
    const [approve, setIsApprove] = useState<boolean | undefined>();
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [productOpts, setProductOpts] = useState<ProductInfor[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [inboundType, setInboundType] = useState<"CHUYEN_KHO_NOI_BO" | "NHAP_TU_NHA_CUNG_CAP">("CHUYEN_KHO_NOI_BO");
    const [product, setProduct] = useState<ProductInfor>();
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
            toBranch: {
                id: userInfo?.branch?.id ? Number(userInfo?.branch?.id) : undefined,
            },
            approvedBy: undefined,
            isApproved: undefined,
            taxable: false,
            productInbounds: [],
            totalPrice: undefined,
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

    const handleOpenModal = (action: string) => {
        setAction(action);
        if (action !== "") {
            onOpen();
        }
    };

    const handleTypeProduct = (inputString: string) => {
        debouncedFetchOptions(inputString);
        return inputString;
    };

    // Hàm để nhận giá trị totalPrice từ ProductsTableAfterCheck
    const handleTotalPriceChange = (newTotalPrice: number) => {
        setTotalPrice(newTotalPrice); // Cập nhật giá trị totalPrice
    };

    const addItem = (e?: React.MouseEvent) => {
        e?.preventDefault(); // Đảm bảo sự kiện có thể không được truyền vào
        const cleanedProduct = {
            ...product,
            // Loại bỏ hoàn toàn trường "batches"
            batches: undefined,
        };
        setValue("productInbounds", [...products, cleanedProduct]); // Cập nhật giá trị với product đã loại bỏ "batches"
    };

    const handleApprove = async (accept: boolean) => {
        const response = await approveInbound(inboundId as string, accept, sessionToken);
        if (response.status === "SUCCESS") {
            router.push("/inbound/list");
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
                    res = await changeInboundStatus(watch("inboundId")!.toString(), "CHO_DUYET", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Gửi yêu cầu duyệt đơn thành công!");
                    }
                    router.push(`/inbound/list`);
                    break;
                case "BỎ_DUYỆT":
                    res = await changeInboundStatus(watch("inboundId")!.toString(), "BAN_NHAP", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Hủy yêu cầu duyệt đơn thành công!");
                    }
                    router.push(`/inbound/update/` + watch("inboundId"));
                    break;
                case "DUYỆT":
                    await handleApprove(true);
                    router.push(`/inbound/list`);
                    break;
                case "TỪ_CHỐI":
                    await handleApprove(false);
                    router.push(`/inbound/list`);
                    break;
                case "KIỂM":
                    res = await changeInboundStatus(watch("inboundId")!.toString(), "KIEM_HANG", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Chuyển đơn nhập hàng sang trạng thái kiểm hàng thành công!");
                    }
                    router.push(`/inbound/update/` + watch("inboundId"));
                    break;
                case "HOAN_THANH":
                    res = await changeInboundStatus(watch("inboundId")!.toString(), "HOAN_THANH", sessionToken);
                    if (res.status === "SUCCESS") {
                        toast.success("Lưu đơn, nhập hàng và xác nhận đơn hoàn thành thành công!");
                    }
                    router.push(`/inbound/list`);
                    break;
                case "EXPORT":
                    handleDownload();
                    break;
                default:
                    await initInbound();
                    break;
            }
            setAction("");
        } catch (error) {
            console.error("Error handling action:", error);
            toast.error("Có lỗi xảy ra khi xử lý yêu cầu");
        }
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
                setValue("taxable", response.data.taxable);
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
                // Cập nhật form
                setValue("inboundId", response.data.id);
                setValue("inboundCode", response.data.inboundCode);
                setValue("inboundType", response.data.inboundType);
                setValue("createdDate", response.data.createdDate);
                setValue("toBranch.id", response.data.toBranch?.id);
                setValue("fromBranch.id", response.data.fromBranch?.id);
                setValue("note", response.data.note);
                setValue("createdBy.id", response.data.createdBy?.id);
                setValue("supplier.id", response.data.supplier?.id); // Cập nhật supplier ID
                setValue("approvedBy.id", response.data.approvedBy?.id);
                setValue("isApproved", response.data.isApproved);
                setValue("taxable", response.data.taxable);
                setValue("productInbounds", response.data.productBatchDetails);

                // Cập nhật state
                setUser(response.data.createdBy);
                setApprover(response.data.approvedBy);
                setBranch(response.data.toBranch);
                setInboundStatus(response.data.status);
                setInboundType(response.data.inboundType);
                setSelectedSupplier(response.data.supplier); // Cập nhật selectedSupplier
                setSelectedFromBranch(response.data.fromBranch);
                setIsApprove(response.data.isApproved);

                // Trigger `getBranchOpts` nếu cần
                if (response.data.inboundType === "CHUYEN_KHO_NOI_BO") {
                    await getBranchOpts(response.data.toBranch.id);
                }

                console.log(response.data);
            } else {
                router.push("/not-found");
            }
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
        const initializeData = async () => {
            try {
                // Ưu tiên gọi các API
                await getSupplierOpts();
                await getBranchOpts("");

                // Logic tùy thuộc vào viewMode
                if (viewMode === "create") {
                    onOpen();
                } else {
                    await getInforInbound();
                }
            } catch (error) {
                console.error("Lỗi khi khởi tạo dữ liệu:", error);
            }
        };

        initializeData();
    }, [viewMode]); // Thêm viewMode làm dependency để đảm bảo logic phản ứng đúng

    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | undefined>();
    const [selectedFromBranch, setSelectedFromBranch] = useState<Branch | undefined>();

    const handleExport = async (id: string, code: string) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);

        try {
            const res = await exportInbound(id, sessionToken);

            if (res && res instanceof Blob) {
                // Tạo URL tạm thời từ Blob để preview
                const url = window.URL.createObjectURL(res);

                // Mở modal và hiển thị preview
                setPreviewUrl(url);
                handleOpenModal("EXPORT");

                toast.success("Xem trước phiếu nhập hàng thành công");
            } else {
                toast.error("Dữ liệu không hợp lệ");
            }
        } catch (error) {
            toast.error("Xem trước phiếu nhập hàng thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (previewUrl) {
            const link = document.createElement('a');
            link.href = previewUrl;
            link.setAttribute('download', 'inbound-' + watch("inboundCode") + '.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Xuất phiếu nhập hàng thành công")
        }
    };

    useEffect(() => {
        if (selectedSupId) {
            const sup = suppliers.find((item: Supplier) => item.id.toString() === selectedSupId);
            setSelectedSupplier(sup); // Đồng bộ supplier theo selectedSupId
        }
    }, [selectedSupId, suppliers]);

    useEffect(() => {
        if (selectedFromBranchId) {
            const branch = branches.find((item: Branch) => item.id.toString() === selectedFromBranchId);
            setSelectedFromBranch(branch);
        }
    }, [selectedFromBranchId, branches]);

    const onSubmit = async (inbound: InboundBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        inbound.totalPrice = totalPrice?.toString() || "0";
        console.log(inbound);
        setLoading(true);
        try {
            if (inboundType === "NHAP_TU_NHA_CUNG_CAP") delete inbound.fromBranch;
            else delete inbound.supplier;
            // Nếu là KIEM_HANG, thực hiện ngay API submitInbound và dừng
            if (inboundStatus === "KIEM_HANG") {
                const response = await submitInbound(inbound, sessionToken);
                if (response?.status === "SUCCESS") {
                    if (action === "HOAN_THANH") {
                        handleOpenModal(action);
                        return;
                    }
                    toast.success("Lưu đơn và nhập hàng thành công!")
                    router.push("/inbound/list");
                    router.refresh();
                } else {
                    toast.error(response?.message || "Đã xảy ra lỗi khi xử lý kiểm hàng!");
                }
                return; // Ngừng thực thi đoạn mã tiếp theo
            }

            // Tiếp tục nếu không phải KIEM_HANG
            const response = await submitDraft(inbound, sessionToken);

            if (response?.status === "SUCCESS") {
                await changeInboundStatus(watch("inboundId")!.toString(), "BAN_NHAP", sessionToken);
                if (action === "CHO_DUYET") {
                    handleOpenModal(action);
                    return;
                }
                toast.success("Lưu đơn nhập hàng thành công!")
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
                {viewMode !== "create" && (
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

                                <div className="flex w-full items-center gap-2 xl:w-1/3">
                                    <label className="mr-2 w-fit whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                        Trạng thái duyệt:
                                    </label>
                                    {(() => {
                                        switch (approve) {
                                            case false:
                                                return (
                                                    <p className="inline-flex rounded bg-danger/10 px-3 py-1 text-sm font-medium text-danger">
                                                        Đơn bị từ chối
                                                    </p>
                                                );
                                            case true:
                                                return (
                                                    <p className="inline-flex rounded bg-success/10 px-3 py-1 text-sm font-medium text-success">
                                                        Đơn đã được duyệt
                                                    </p>
                                                );
                                            default:
                                                return (
                                                    <p className="inline-flex rounded bg-warning/10 px-3 py-1 text-sm font-medium text-warning">
                                                        Đơn chưa được duyệt
                                                    </p>
                                                );
                                        }
                                    })()}
                                </div>

                                <div className="flex w-full items-center gap-2 xl:w-1/6">
                                    <Button
                                        hidden={
                                            !["KIEM_HANG", "DANG_THANH_TOAN", "HOAN_THANH"].includes(inboundStatus as string)
                                        }
                                        icon={<FaFileImport />}
                                        className="bg-green-500 text-white hover:bg-green-600 hover:text-white"
                                        onClick={() => handleExport(inboundId as string, watch("inboundCode").toString())}
                                    >
                                        Xuất file
                                    </Button>
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
                                        rows={5}
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
                                {/* Dòng đầu tiên */}
                                <div className="mb-4 flex items-center">
                                    <label className="mr-3 text-sm font-medium text-black dark:text-white">
                                        Có tính thuế nhập hàng:{" "}
                                    </label>
                                    <input
                                        type="checkbox"
                                        {...register("taxable")} // Kế thừa đăng ký từ React Hook Form
                                        checked={watch("taxable")} // Đồng bộ hóa với giá trị từ React Hook Form
                                        onChange={(e) => setValue("taxable", e.target.checked)} // Cập nhật giá trị
                                        disabled={viewMode === "details" || inboundStatus === "KIEM_HANG"} // Vô hiệu hóa theo điều kiện
                                        className="border-gray-300 rounded text-primary focus:ring-primary disabled:cursor-not-allowed"
                                    />
                                </div>

                                {/* Dòng thứ hai */}
                                <div className="flex items-center">
                                    <label className="mr-3 text-sm font-medium text-black dark:text-white">
                                        Trạng thái đơn:
                                    </label>
                                    {renderInboundStatus(inboundStatus)}
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
                                <IconButton
                                    icon={<FaPlus />}
                                    onClick={(e) => {
                                        e.preventDefault();
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
                                                              batchCode: "",
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
                                    setProducts={setValue}
                                    taxable={watch("taxable")}
                                    errors={errors.productInbounds || []} // Truyền lỗi vào đây
                                    totalPrice={watch("totalPrice")}
                                    onTotalPriceChange={handleTotalPriceChange}
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
                                                              batchCode: "",
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
                                    taxable={watch("taxable")}
                                    errors={errors}
                                    setProducts={setValue}
                                    totalPrice={watch("totalPrice")}
                                    onTotalPriceChange={handleTotalPriceChange}
                                />
                            )
                        ) : (
                            <ProductsTableBeforeCheck
                                data={products || []}
                                active={
                                    viewMode !== "details" && ["CHUA_LUU", "BAN_NHAP"].includes(inboundStatus as string)
                                }
                                setProducts={setValue}
                                errors={errors.productInbounds || []} // Truyền lỗi vào đây
                                taxable={watch("taxable")}
                            />
                        )}

                        {viewMode === "create" && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => {
                                            setAction("CHO_DUYET");
                                        }}
                                    >
                                        Tạo và gửi yêu cầu duyệt
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        type="submit"
                                    >
                                        Lưu đơn
                                    </button>
                                </div>
                            </div>
                        )}

                        {viewMode === "update" && ["CHUA_LUU", "BAN_NHAP"].includes(inboundStatus as string) && (
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
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            </div>
                        )}

                        {viewMode === "update" && ["KIEM_HANG"].includes(inboundStatus as string) && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type="submit"
                                        onClick={() => {
                                            setAction("HOAN_THANH");
                                            console.log(errors);
                                        }}
                                    >
                                        Cập nhật, nhập hàng và xác nhận đơn hoàn thành
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        type="submit"
                                    >
                                        Cập nhật và nhập hàng vào kho
                                    </button>
                                </div>
                            </div>
                        )}
                        {viewMode === "details" &&
                            (userInfo?.roles[0].type === "ADMIN" || userInfo?.roles[0].type === "MANAGER") &&
                            ["CHO_DUYET"].includes(inboundStatus as string) && (
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
                        {viewMode === "details" &&
                            ["CHO_DUYET"].includes(inboundStatus as string) &&
                            userInfo?.roles[0].type === "STAFF" &&
                            ["CHO_DUYET"].includes(inboundStatus as string) && (
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
                                            onClick={() => router.push(`/inbound/list`)}
                                            type={"button"}
                                        >
                                            Quay lại danh sách
                                        </button>
                                    </div>
                                </div>
                            )}
                        {viewMode === "details" &&
                            //userInfo?.roles[0].type === "STAFF" &&
                            inboundStatus === "BAN_NHAP" && (
                                <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                    <div className="w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                            onClick={() => handleOpenModal("CHO_DUYET")}
                                            type={"button"}
                                        >
                                            Gửi yêu cầu duyệt đơn
                                        </button>
                                    </div>
                                    <div className="w-1/2">
                                        <button
                                            className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                            onClick={() => router.push(`/inbound/list`)}
                                            type={"button"}
                                        >
                                            Quay lại danh sách
                                        </button>
                                    </div>
                                </div>
                            )}
                        {viewMode === "details" && inboundStatus === "CHO_HANG" && (
                            <div className="mt-6.5 flex flex-col items-center gap-6 xl:flex-row">
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                        type={"button"}
                                        onClick={() => handleOpenModal("KIỂM")}
                                    >
                                        Kiểm hàng
                                    </button>
                                </div>
                                <div className="w-1/2">
                                    <button
                                        className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-gray/90"
                                        onClick={() => router.push(`/inbound/list`)}
                                        type={"button"}
                                    >
                                        Quay lại danh sách
                                    </button>
                                </div>
                            </div>
                        )}
                        {viewMode === "details" && inboundStatus === "KIEM_HANG" && (
                            <button
                                className="mt-6.5 flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                type="submit"
                                onClick={() => {
                                    handleOpenModal("HOAN_THANH");
                                    console.log(errors);
                                }}
                            >
                                Nhập hàng
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
                                                        <p>Vui lòng chọn kiểu nhập hàng</p>
                                                        <Select
                                                            value={inboundType}
                                                            onChange={(e) =>
                                                                setInboundType(
                                                                    e.target.value as
                                                                        | "NHAP_TU_NHA_CUNG_CAP"
                                                                        | "CHUYEN_KHO_NOI_BO"
                                                                )
                                                            }
                                                            label="Chọn kiểu nhập hàng"
                                                            className="max-w-full"
                                                        >
                                                            <SelectItem
                                                                key={"NHAP_TU_NHA_CUNG_CAP"}
                                                                isDisabled={userInfo?.branch.branchType === "SUB"}
                                                            >
                                                                Nhập từ nhà cung cấp
                                                            </SelectItem>
                                                            <SelectItem key={"CHUYEN_KHO_NOI_BO"}>
                                                                Chuyển kho nội bộ
                                                            </SelectItem>
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
                                                    toast.warning("Bỏ duyệt đơn nhập hàng!");
                                                    break;
                                                case "TỪ_CHỐI":
                                                    toast.warning("Từ chối duyệt đơn nhập hàng!");
                                                    break;
                                                case "KIỂM":
                                                    toast.warning(
                                                        "Hủy chuyển đơn nhập hàng sang trạng thái kiểm hàng thành công!"
                                                    );
                                                    break;
                                                case "HOAN_THANH":
                                                    toast.warning(
                                                        "Lưu đơn, nhập hàng thành công nhưng xác nhận đơn hoàn thành thất bại!"
                                                    );
                                                    router.push(`/inbound/list`);
                                                    break;
                                                case "EXPORT":
                                                    toast.error("Hủy xuất phiếu!");
                                                    break;
                                                default:
                                                    toast.error("Khởi tạo đơn nhập hàng thất bại!");
                                                    router.push(`/inbound/list`);
                                                    break;
                                            }
                                            handleOpenModal("");
                                            onClose(); // Đóng modal
                                        }}
                                    >
                                        Không
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={async () => {
                                            await handleAction(action); // Xử lý logic chính
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
        );
    }
};

export default InboundForm;

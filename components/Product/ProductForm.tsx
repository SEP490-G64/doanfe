"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BsLifePreserver } from "react-icons/bs";
import { IoInformationCircle, IoTrashBinOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { MdOutlineBloodtype, MdOutlinePrecisionManufacturing } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import UploadImage from "@/components/UI/UploadImage";
import Loader from "@/components/common/Loader";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { ProductBody, ProductBodyType } from "@/lib/schemaValidate/productSchema";
import { createProduct, getProductById, updateProduct } from "@/services/productServices";
import { getAllCategory } from "@/services/categoryServices";
import { getAllType } from "@/services/typeServices";
import { getAllManufacturer } from "@/services/manufacturerServices";
import IconButton from "@/components/UI/IconButton";
import { Category } from "@/types/category";
import { Type } from "@/types/type";
import { Manufacturer } from "@/types/manufacturer";
import { getAllUnit } from "@/services/unitServices";
import { Unit } from "@/types/unit";
import Link from "next/link";
import AllowProductTable from "@/components/Product/AllowProductTable";

const ProductForm = ({ viewMode, productId }: { viewMode: "details" | "update" | "create"; productId?: string }) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const { isOpen, onOpenChange } = useDisclosure();
    const [cateOpts, setCateOpts] = useState([]);
    const [typeOpts, setTypeOpts] = useState([]);
    const [manOpts, setManOpts] = useState([]);
    const [unitOpts, setUnitOpts] = useState([]);
    const [action, setAction] = useState<string>("");
    const specialConditionOpts = [
        {
            value: "NHIET_DO",
            label: "Nhiệt độ",
        },
        {
            value: "DO_AM",
            label: "Độ ẩm",
        },
        {
            value: "ANH_SANG",
            label: "Ánh sáng",
        },
        {
            value: "KHONG_KHI",
            label: "Không khí",
        },
        {
            value: "KHAC",
            label: "Khác",
        },
    ];

    const statusOpts = [
        {
            value: "CON_HANG",
            label: "Còn hàng",
        },
        {
            value: "HET_HANG",
            label: "Hết hàng",
        },
        {
            value: "NGUNG_KINH_DOANH",
            label: "Ngừng kinh doanh",
        },
    ];

    const getDataOptions = async () => {
        setLoading(true);
        try {
            const response = await Promise.all([
                getAllCategory(sessionToken),
                getAllType(sessionToken),
                getAllManufacturer(sessionToken),
                getAllUnit(sessionToken),
            ]);

            if (response) {
                setCateOpts(response[0].data.map((c: Category) => ({ value: c.id, label: c.categoryName })));
                setTypeOpts(response[1].data.map((t: Type) => ({ value: t.id, label: t.typeName })));
                setManOpts(response[2].data.map((m: Manufacturer) => ({ value: m.id, label: m.manufacturerName })));
                setUnitOpts(response[3].data.map((u: Unit) => ({ value: u.id, label: u.unitName })));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        setValue,
        control,
        formState: { errors },
    } = useForm<ProductBodyType>({
        resolver: zodResolver(ProductBody),
        defaultValues: {
            productName: undefined,
            productCode: undefined,
            registrationCode: undefined,
            urlImage: undefined,
            activeIngredient: undefined,
            excipient: undefined,
            formulation: undefined,
            status: "",
            category: undefined,
            type: undefined,
            manufacturer: undefined,
            baseUnits: undefined,
            branchProducts: [
                {
                    branchId: undefined,
                    storageLocation: { selfName: "Chi nhánh số 2" },
                    maxQuantity: undefined,
                    minQuantity: undefined,
                    quantity: undefined,
                },
            ],
            specialConditions: undefined,
        },
    });

    const baseUnitForm = useFieldArray({
        control,
        name: "baseUnits",
    });

    const specialConditionsForm = useFieldArray({
        control,
        name: "specialConditions",
    });

    const branchProductForm = useFieldArray({
        control,
        name: "branchProducts",
    });

    const handleOpenModal = (Action: string) => {
        setAction(Action);
        onOpenChange();
    };

    const getProductInfo = async () => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            const response = await getProductById(productId as string, sessionToken);

            if (response.message === "200 OK") {
                const fields: [
                    "productName",
                    "productCode",
                    "registrationCode",
                    "urlImage",
                    "activeIngredient",
                    "excipient",
                    "formulation",
                    "status",
                    "category",
                    "type",
                    "manufacturer",
                    "baseUnits",
                    "branchProducts",
                    "specialConditions",
                ] = [
                    "productName",
                    "productCode",
                    "registrationCode",
                    "urlImage",
                    "activeIngredient",
                    "excipient",
                    "formulation",
                    "status",
                    "category",
                    "type",
                    "manufacturer",
                    "baseUnits",
                    "branchProducts",
                    "specialConditions",
                ];

                fields.forEach((field) => setValue(field, response.data[field]));
            } else router.push("/not-found");
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDataOptions();
        if (viewMode != "create") {
            getProductInfo();
        }
    }, []);

    const onSubmit = async (product: ProductBodyType) => {
        if (loading) {
            toast.warning("Hệ thống đang xử lý dữ liệu");
            return;
        }
        setLoading(true);
        try {
            let response;
            if (viewMode === "create") response = await createProduct(product, sessionToken);
            else response = await updateProduct(product, productId as string, sessionToken);

            if (response && response.message === "200 OK") {
                router.push("/products/list");
                router.refresh();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader />;
    else
        return (
            <>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                        <div className="flex flex-col gap-9">
                            {/* <!-- Input Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Thông tin sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="block text-sm font-medium text-black dark:text-white">
                                                Tên sản phẩm <span className="text-meta-1">*</span>
                                            </label>
                                            <Link
                                                href={"#"}
                                                className="text-primary"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOpenModal("allow-products");
                                                }}
                                            >
                                                Tra cứu thuốc
                                            </Link>
                                        </div>

                                        <input
                                            {...register("productName")}
                                            type="email"
                                            placeholder="Nhập tên sản phẩm"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        {errors.productName && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.productName.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label
                                                className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Mã sản phẩm <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("productCode")}
                                                type="text"
                                                placeholder="Nhập mã sản phẩm"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            {errors.productCode && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.productCode.message}
                                                </span>
                                            )}
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Số đăng ký <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("registrationCode")}
                                                type="text"
                                                placeholder="Nhập số đăng ký"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            {errors.registrationCode && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.registrationCode.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Bào chế <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("formulation")}
                                                type="text"
                                                placeholder="Nhập bào chế"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            {errors.formulation && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.formulation.message}
                                                </span>
                                            )}
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Hoạt chất <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("activeIngredient")}
                                                type="text"
                                                placeholder="Nhập hoạt chất"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            {errors.activeIngredient && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.activeIngredient.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tá dược <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            {...register("excipient")}
                                            type="text"
                                            placeholder="Nhập tá dược"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        {errors.excipient && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.excipient.message}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Quy cách đóng gói <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nhập quy cách đóng gói"
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Giá sản phẩm --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Giá sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Giá nhập
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập giá nhập"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Giá bán <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Nhập giá bán"
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Điều kiện đặc biệt</h3>
                                    <IconButton
                                        icon={<FaPlus />}
                                        rounded="full"
                                        size="small"
                                        onClick={(e) => {
                                            e?.preventDefault();
                                            specialConditionsForm.append({
                                                conditionType: "",
                                                handlingInstruction: "",
                                            });
                                        }}
                                    />
                                </div>
                                <div className="p-6.5">
                                    {specialConditionsForm.fields.map((field, index) => (
                                        <div key={field.id} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-6/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Kiểu điều kiện
                                                </label>
                                                <SelectGroupTwo
                                                    register={{
                                                        ...register(`specialConditions.${index}.conditionType`),
                                                    }}
                                                    watch={watch("specialConditions")}
                                                    icon={<BsLifePreserver />}
                                                    placeholder="Chọn điều kiện"
                                                    data={specialConditionOpts}
                                                />
                                                {errors.specialConditions?.[index]?.conditionType && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.specialConditions?.[index]?.conditionType.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-5/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Hướng dẫn xử lý (Nếu cần)
                                                </label>
                                                <input
                                                    {...register(`specialConditions.${index}.handlingInstruction`)}
                                                    type="text"
                                                    placeholder="Hướng dẫn xử lý"
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.specialConditions?.[index]?.handlingInstruction && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.specialConditions?.[index]?.handlingInstruction.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="m-auto w-1/12 text-center">
                                                <IconButton
                                                    icon={<IoTrashBinOutline />}
                                                    rounded="full"
                                                    size="small"
                                                    type="danger"
                                                    onClick={(e) => {
                                                        e?.preventDefault();
                                                        specialConditionsForm.remove(index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Đơn vị quy đổi</h3>
                                    <IconButton
                                        icon={<FaPlus />}
                                        rounded="full"
                                        size="small"
                                        onClick={(e) => {
                                            e?.preventDefault();
                                            baseUnitForm.append({
                                                id: "",
                                                quantity: 0,
                                            });
                                        }}
                                    />
                                </div>
                                <div className="p-6.5">
                                    {baseUnitForm.fields.map((field, index) => (
                                        <div key={field.id} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-6/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Đơn vị <span className="text-meta-1">*</span>
                                                </label>
                                                <SelectGroupTwo
                                                    register={{
                                                        ...register(`baseUnits.${index}.id`),
                                                    }}
                                                    watch={watch("baseUnits")}
                                                    icon={<BsLifePreserver />}
                                                    placeholder="Chọn đơn vị"
                                                    data={unitOpts}
                                                />
                                                {errors.baseUnits?.[index]?.id && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.baseUnits?.[index]?.id.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-5/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Số lượng <span className="text-meta-1">*</span>
                                                </label>
                                                <input
                                                    {...register(`baseUnits.${index}.quantity`)}
                                                    type="text"
                                                    placeholder="Nhập số lượng"
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.baseUnits?.[index]?.quantity && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.baseUnits?.[index]?.quantity.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="m-auto w-1/12 text-center">
                                                <IconButton
                                                    icon={<IoTrashBinOutline />}
                                                    rounded="full"
                                                    size="small"
                                                    type="danger"
                                                    onClick={(e) => {
                                                        e?.preventDefault();
                                                        baseUnitForm.remove(index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-9">
                            {/* <!-- File upload --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Ảnh sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <UploadImage
                                        sessionToken={sessionToken}
                                        urlImage={getValues("urlImage")}
                                        setValue={setValue}
                                    />
                                </div>
                            </div>
                            {/* <!-- Textarea Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Phân loại sản phẩm</h3>
                                </div>
                                <div className="flex flex-col gap-5.5 p-6.5">
                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc nhóm sản phẩm <span className="text-meta-1">*</span>
                                        </label>
                                        <SelectGroupTwo
                                            register={{ ...register("category.id") }}
                                            watch={watch("category.id")}
                                            icon={<BiCategory />}
                                            placeholder="Chọn nhóm sản phẩm"
                                            data={cateOpts}
                                        />
                                        {errors.category?.id && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.category.id.message}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc loại sản phẩm <span className="text-meta-1">*</span>
                                        </label>
                                        <SelectGroupTwo
                                            register={{ ...register("type.id") }}
                                            watch={watch("type.id")}
                                            icon={<MdOutlineBloodtype />}
                                            placeholder="Chọn loại sản phẩm"
                                            data={typeOpts}
                                        />
                                        {errors.type?.id && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.type.id.message}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Thuộc nhà sản xuất <span className="text-meta-1">*</span>
                                        </label>
                                        <SelectGroupTwo
                                            register={{ ...register("manufacturer.id") }}
                                            watch={watch("manufacturer.id")}
                                            icon={<MdOutlinePrecisionManufacturing />}
                                            placeholder="Chọn nhà sản xuất"
                                            data={manOpts}
                                        />
                                        {errors.manufacturer?.id && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.manufacturer.id.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Checkbox and radio --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Tình trạng thuốc</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tình trạng
                                            </label>
                                            <SelectGroupTwo
                                                register={{ ...register("status") }}
                                                watch={watch("status")}
                                                icon={<IoInformationCircle size={20} />}
                                                placeholder="Chọn tình trạng"
                                                data={statusOpts}
                                            />
                                            {errors.status && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.status.message}
                                                </span>
                                            )}
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Có thể bán
                                            </label>
                                            {/* <SwitcherThree /> */}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tồn kho
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="200"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tồn chi nhánh
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="25"
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Select input --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        Thông tin sản phẩm trong kho
                                    </h3>
                                </div>

                                {branchProductForm.fields.map((field, index) => (
                                    <div className="p-6.5" key={field.id}>
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Chi nhánh
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.storageLocation.selfName`)}
                                                    type="text"
                                                    disabled
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Vị trí
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.branchId`)}
                                                    type="text"
                                                    placeholder="Nhập vị trí"
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.branchProducts?.[index]?.branchId && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.branchProducts?.[index]?.branchId.message}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Số lượng tối thiểu
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.minQuantity`)}
                                                    type="text"
                                                    placeholder="Nhập số lượng tối thiểu"
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.branchProducts?.[index]?.minQuantity && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.branchProducts?.[index]?.minQuantity.message}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Số lượng tối đa
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.maxQuantity`)}
                                                    type="text"
                                                    placeholder="Nhập số lượng tối đa"
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.branchProducts?.[index]?.maxQuantity && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.branchProducts?.[index]?.maxQuantity.message}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col items-center gap-6 xl:flex-row">
                        <div className="w-full xl:w-1/2">
                            {viewMode !== "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-primary bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type="submit"
                                >
                                    {viewMode === "create" ? "Tạo mới" : "Cập nhật"}
                                </button>
                            )}
                            {viewMode === "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-primary bg-primary p-3 font-medium text-gray hover:bg-primary/90"
                                    type={"button"}
                                    onClick={() => router.push(`/products/update/${productId}`)}
                                >
                                    Đi đến cập nhật
                                </button>
                            )}
                        </div>
                        <div className="w-full xl:w-1/2">
                            {viewMode !== "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-stroke/90"
                                    type={"button"}
                                    onClick={() => handleOpenModal("products")}
                                >
                                    Hủy
                                </button>
                            )}
                            {viewMode === "details" && (
                                <button
                                    className="flex w-full justify-center rounded border border-strokedark p-3 font-medium text-strokedark hover:bg-stroke/90"
                                    type={"button"}
                                    onClick={() => router.push(`/products/list`)}
                                >
                                    Quay lại danh sách
                                </button>
                            )}
                        </div>
                    </div>

                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    {(() => {
                                        switch (action) {
                                            case "allow-products":
                                                return <>
                                                    <ModalHeader className="flex flex-col gap-1">Tra cứu thuốc</ModalHeader>
                                                    <ModalBody>
                                                        <p>Danh sách thuốc được bộ y tế quốc gia cho phép lưu hành</p>
                                                        <AllowProductTable/>
                                                    </ModalBody>
                                                </>;
                                            case "products":
                                                return <>
                                                    <ModalHeader className="flex flex-col gap-1">Xác nhận</ModalHeader>
                                                    <ModalBody>
                                                        <p>Bạn có chắc muốn hủy thực hiện hành động này không?</p>
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="default" variant="light" onPress={onClose}>
                                                            Không
                                                        </Button>
                                                        <Button
                                                            color="primary"
                                                            onPress={() => {
                                                                router.push(`/products/list`);
                                                                onClose();
                                                            }}
                                                        >
                                                            Chắc chắn
                                                        </Button>
                                                    </ModalFooter>
                                                </>;
                                        }
                                    })()}
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </form>
            </>
        );
};

export default ProductForm;

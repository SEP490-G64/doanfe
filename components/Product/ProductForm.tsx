"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoInformationCircle, IoTrashBinOutline } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";
import { MdOutlineBloodtype, MdOutlinePrecisionManufacturing } from "react-icons/md";
import { debounce } from "lodash";
import ReactSelect from "react-select";
import { FaPlus } from "react-icons/fa6";
import { BsLifePreserver } from "react-icons/bs";

import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo";
import UploadImage from "@/components/UI/UploadImage";
import Loader from "@/components/common/Loader";
import { useAppContext } from "@/components/AppProvider/AppProvider";
import { ProductBody, ProductBodyType } from "@/lib/schemaValidate/productSchema";
import { createProduct, getAllowedProducts, getProductById, updateProduct } from "@/services/productServices";
import { getAllCategory } from "@/services/categoryServices";
import { getAllType } from "@/services/typeServices";
import { getAllManufacturer } from "@/services/manufacturerServices";
import IconButton from "@/components/UI/IconButton";
import { Category } from "@/types/category";
import { Type } from "@/types/type";
import { Manufacturer } from "@/types/manufacturer";
import { getAllUnit } from "@/services/unitServices";
import { Unit } from "@/types/unit";
import { TokenDecoded } from "@/types/tokenDecoded";
import { jwtDecode } from "jwt-decode";
import Unauthorized from "@/components/common/Unauthorized";
import { number } from "zod";
import HeaderTaskbar from "../HeaderTaskbar/GoBackHeaderTaskbar/page";

const ProductForm = ({ viewMode, productId }: { viewMode: "details" | "update" | "create"; productId?: string }) => {
    const [loading, setLoading] = useState(false);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    const router = useRouter();
    const { sessionToken } = useAppContext();
    const tokenDecoded: TokenDecoded = jwtDecode(sessionToken);
    const userInfo = tokenDecoded.information;
    const { isOpen, onOpenChange } = useDisclosure();
    const [productOpts, setProductOpts] = useState<ProductBodyType[]>([]);
    const [product, setProduct] = useState<ProductBodyType>();
    const [cateOpts, setCateOpts] = useState([]);
    const [typeOpts, setTypeOpts] = useState([]);
    const [manOpts, setManOpts] = useState([]);
    const [unitOpts, setUnitOpts] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(number);

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
        setValue,
        control,
        formState: { errors },
    } = useForm<ProductBodyType>({
        resolver: zodResolver(ProductBody),
        defaultValues: {
            productName: undefined,
            registrationCode: undefined,
            urlImage: undefined,
            activeIngredient: undefined,
            excipient: undefined,
            formulation: undefined,
            status: "CON_HANG",
            category: undefined,
            type: undefined,
            manufacturer: undefined,
            baseUnit: undefined,
            unitConversions: undefined,
            branchProducts: [
                {
                    id: undefined,
                    branch: { id: undefined, branchName: undefined },
                    storageLocation: { shelfName: undefined },
                    maxQuantity: undefined,
                    minQuantity: undefined,
                    quantity: undefined,
                },
            ],
            specialConditions: undefined,
            inboundPrice: undefined,
            sellPrice: undefined,
        },
    });

    const getProductOpts = async (inputString: string) => {
        if (isFetchingProduct) return;
        setIsFetchingProduct(true);
        try {
            const response = await getAllowedProducts(inputString, sessionToken);

            if (response.message === "200 OK") {
                setProductOpts(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetchingProduct(false);
        }
    };

    // Debounced fetch options
    const debouncedFetchOptions = useCallback(
        debounce((inputValue: string) => {
            if (inputValue) {
                getProductOpts(inputValue);
            } else {
                setProductOpts([]);
            }
        }, 500),
        []
    );

    const handleTypeProduct = (inputString: string) => {
        debouncedFetchOptions(inputString);
        return inputString;
    };

    const unitConversionForm = useFieldArray({
        control,
        name: "unitConversions",
    });

    const specialConditionsForm = useFieldArray({
        control,
        name: "specialConditions",
    });

    const branchProductForm = useFieldArray({
        control,
        name: "branchProducts",
    });

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
                    "registrationCode",
                    "urlImage",
                    "activeIngredient",
                    "excipient",
                    "formulation",
                    "status",
                    "category",
                    "type",
                    "manufacturer",
                    "baseUnit",
                    "unitConversions",
                    "branchProducts",
                    "specialConditions",
                    "inboundPrice",
                    "sellPrice",
                ] = [
                    "productName",
                    "registrationCode",
                    "urlImage",
                    "activeIngredient",
                    "excipient",
                    "formulation",
                    "status",
                    "category",
                    "type",
                    "manufacturer",
                    "baseUnit",
                    "unitConversions",
                    "branchProducts",
                    "specialConditions",
                    "inboundPrice",
                    "sellPrice",
                ];

                fields.forEach((field) => setValue(field, response.data[field]));

                const branchProduct = response.data.branchProducts.find(
                    (product) => product.branch?.id === userInfo?.branch?.id
                );

                // Cập nhật các trường của sản phẩm đầu tiên (index 0)
                setValue(
                    `branchProducts.0.branch.branchName`,
                    branchProduct ? branchProduct.branch?.branchName : userInfo?.branch?.branchName
                );
                setValue(
                    `branchProducts.0.storageLocation.shelfName`,
                    branchProduct ? branchProduct.storageLocation?.shelfName : undefined
                );
                setValue(`branchProducts.0.minQuantity`, branchProduct ? branchProduct.minQuantity : undefined);
                setValue(`branchProducts.0.maxQuantity`, branchProduct ? branchProduct.maxQuantity : undefined);
                setValue(`branchProducts.0.quantity`, branchProduct ? branchProduct.quantity : 0);

                // Tính tổng quantity trong branchProducts
                const totalQuantity = response.data.branchProducts.reduce((total, product) => {
                    return total + (product.quantity || 0); // Sử dụng giá trị 0 nếu quantity không tồn tại
                }, 0);

                setTotalQuantity(totalQuantity);
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
    else {
        if (!userInfo?.roles?.some((role) => role.type === "MANAGER" || role.type === "STAFF")) {
            return <Unauthorized></Unauthorized>;
        }
        return (
            <>
                <HeaderTaskbar />
                <form onSubmit={handleSubmit(onSubmit)} noValidate method={"post"}>
                    <div className="grid grid-cols-1 gap-9 sm:grid-cols-[2fr_1fr]">
                        <div className="flex flex-col gap-9">
                            {/* <!-- Input Fields --> */}
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Thông tin sản phẩm</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5" hidden={viewMode == "details"}>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tra cứu sản phẩm
                                        </label>
                                        <ReactSelect
                                            defaultValue={product ? product.registrationCode : ""}
                                            onChange={(optionValue) => {
                                                if (!optionValue) return;
                                                const option = productOpts.find(
                                                    (opt) => opt.registrationCode === optionValue.value
                                                );
                                                setProduct(option);
                                                option?.productName && setValue("productName", option.productName);
                                                option?.registrationCode &&
                                                    setValue("registrationCode", option.registrationCode);
                                                option?.activeIngredient &&
                                                    setValue("activeIngredient", option.activeIngredient);
                                                option?.excipient && setValue("excipient", option.excipient);
                                                option?.formulation && setValue("formulation", option.formulation);
                                                option?.urlImage && setValue("urlImage", option.urlImage);
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
                                                    padding: "0.5rem 1rem",
                                                    cursor: "text",
                                                }),
                                            }}
                                            className={"w-full"}
                                        />
                                    </div>

                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Tên sản phẩm <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            {...register("productName")}
                                            type="email"
                                            placeholder="Nhập tên sản phẩm"
                                            disabled={viewMode === "details"}
                                            className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                        {errors.productName && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.productName.message}
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Số đăng ký <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("registrationCode")}
                                                type="text"
                                                placeholder="Nhập số đăng ký"
                                                disabled={viewMode === "details"}
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
                                        <div className="w-full">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Bào chế <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("formulation")}
                                                type="text"
                                                placeholder="Nhập bào chế"
                                                disabled={viewMode === "details"}
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                            {errors.formulation && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.formulation.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Hoạt chất <span className="text-meta-1">*</span>
                                            </label>
                                            <input
                                                {...register("activeIngredient")}
                                                type="text"
                                                placeholder="Nhập hoạt chất"
                                                disabled={viewMode === "details"}
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
                                            Tá dược
                                        </label>
                                        <textarea
                                            rows={5}
                                            {...register("excipient")}
                                            placeholder="Nhập tá dược"
                                            disabled={viewMode === "details"}
                                            className="w-full rounded-lg border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                        {errors.excipient && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.excipient.message}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Đơn vị cơ sở <span className="text-meta-1">*</span>
                                        </label>
                                        <SelectGroupTwo
                                            register={{ ...register("baseUnit.id") }}
                                            watch={watch("baseUnit.id")}
                                            icon={<BsLifePreserver />}
                                            placeholder="Chọn đơn vị"
                                            disabled={viewMode === "details"}
                                            data={unitOpts}
                                        />
                                        {errors.baseUnit?.id && (
                                            <span className="mt-1 block w-full text-sm text-rose-500">
                                                {errors.baseUnit.id.message}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Giá sản phẩm --> */}
                            {viewMode !== "create" && (
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
                                                    {...register("inboundPrice")}
                                                    type="text"
                                                    placeholder="Nhập giá nhập"
                                                    disabled={
                                                        viewMode === "details" || userInfo?.roles[0].type !== "MANAGER"
                                                    }
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </div>

                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Giá bán <span className="text-meta-1">*</span>
                                                </label>
                                                <input
                                                    {...register("sellPrice")}
                                                    type="text"
                                                    placeholder="Nhập giá bán"
                                                    disabled={
                                                        viewMode === "details" || userInfo?.roles[0].type !== "MANAGER"
                                                    }
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Điều kiện đặc biệt</h3>
                                    {viewMode !== "details" && (
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
                                    )}
                                </div>
                                <div className="p-6.5">
                                    {specialConditionsForm.fields.map((field, index) => (
                                        <div key={field.id} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-3/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Kiểu điều kiện <span className="text-meta-1">*</span>
                                                </label>
                                                <SelectGroupTwo
                                                    register={{
                                                        ...register(`specialConditions.${index}.conditionType`),
                                                    }}
                                                    watch={watch(`specialConditions.${index}.conditionType`)}
                                                    icon={<BsLifePreserver />}
                                                    placeholder="Chọn điều kiện"
                                                    disabled={viewMode === "details"}
                                                    data={specialConditionOpts}
                                                />
                                                {errors.specialConditions?.[index]?.conditionType && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.specialConditions?.[index]?.conditionType.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-8/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Hướng dẫn xử lý <span className="text-meta-1">*</span>
                                                </label>
                                                <input
                                                    {...register(`specialConditions.${index}.handlingInstruction`)}
                                                    type="text"
                                                    placeholder="Hướng dẫn xử lý"
                                                    disabled={viewMode === "details"}
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.specialConditions?.[index]?.handlingInstruction && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.specialConditions?.[index]?.handlingInstruction.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="m-auto w-1/12 text-center">
                                                {viewMode !== "details" && (
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
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="flex items-center justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Đơn vị quy đổi</h3>
                                    {!watch("baseUnit.id") && (
                                        <span className="text-sm text-rose-500">
                                            Vui lòng chọn đơn vị cơ sở trước khi thêm chuyển đổi đơn vị
                                        </span>
                                    )}
                                    {viewMode !== "details" && (
                                        <IconButton
                                            icon={<FaPlus />}
                                            rounded="full"
                                            size="small"
                                            onClick={(e) => {
                                                e?.preventDefault();

                                                if (!watch("baseUnit.id")) {
                                                    return;
                                                }

                                                unitConversionForm.append({
                                                    id: "",
                                                    largerUnit: { id: "" },
                                                    smallerUnit: { id: "" },
                                                    factorConversion: 0,
                                                });
                                            }}
                                        />
                                    )}
                                </div>
                                <div className="p-6.5">
                                    {unitConversionForm.fields.map((field, index) => (
                                        <div key={field.id} className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-5/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Đơn vị <span className="text-meta-1">*</span>
                                                </label>
                                                <SelectGroupTwo
                                                    register={{
                                                        ...register(`unitConversions.${index}.smallerUnit.id`),
                                                    }}
                                                    watch={watch(`unitConversions.${index}.smallerUnit.id`)}
                                                    icon={<BsLifePreserver />}
                                                    placeholder="Chọn đơn vị"
                                                    disabled={viewMode === "details"}
                                                    data={unitOpts}
                                                />
                                                {errors.unitConversions?.[index]?.smallerUnit?.id && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.unitConversions?.[index]?.smallerUnit?.id.message}
                                                    </span>
                                                )}
                                                {watch("baseUnit.id") ===
                                                    watch(`unitConversions.${index}.smallerUnit.id`) && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        Đơn vị quy đổi không thể trùng với đơn vị cơ sở
                                                    </span>
                                                )}
                                            </div>

                                            <div className="w-6/12">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Số lượng (1 đơn vị cơ sở = ? đơn vị){" "}
                                                    <span className="text-meta-1">*</span>
                                                </label>
                                                <input
                                                    {...register(`unitConversions.${index}.factorConversion`)}
                                                    type="text"
                                                    placeholder="Nhập số lượng"
                                                    disabled={viewMode === "details"}
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.unitConversions?.[index]?.factorConversion && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {errors.unitConversions?.[index]?.factorConversion.message}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="m-auto w-1/12 text-center">
                                                {viewMode !== "details" && (
                                                    <IconButton
                                                        icon={<IoTrashBinOutline />}
                                                        rounded="full"
                                                        size="small"
                                                        type="danger"
                                                        onClick={(e) => {
                                                            e?.preventDefault();
                                                            unitConversionForm.remove(index);
                                                        }}
                                                    />
                                                )}
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
                                    <UploadImage sessionToken={sessionToken} watch={watch} setValue={setValue} />
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
                                            disabled={viewMode === "details"}
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
                                            disabled={viewMode === "details"}
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
                                            disabled={viewMode === "details"}
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
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
                                hidden={viewMode === "create"}
                            >
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">Tình trạng thuốc</h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tình trạng
                                            </label>
                                            <SelectGroupTwo
                                                register={{ ...register("status") }}
                                                watch={watch("status")}
                                                icon={<IoInformationCircle size={20} />}
                                                placeholder="Chọn tình trạng"
                                                disabled={viewMode === "details"}
                                                data={statusOpts}
                                            />
                                            {errors.status && (
                                                <span className="mt-1 block w-full text-sm text-rose-500">
                                                    {errors.status.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-6 xl:flex-row">
                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tồn toàn hệ thống
                                            </label>
                                            <input
                                                type="text"
                                                value={totalQuantity ? 0 : totalQuantity}
                                                disabled
                                                className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                            />
                                        </div>

                                        <div className="w-full xl:w-1/2">
                                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                Tồn chi nhánh
                                            </label>
                                            {branchProductForm.fields.map((field, index) => (
                                                <input
                                                    key={field.id}
                                                    hidden={index !== 0}
                                                    {...register(`branchProducts.${index}.quantity`)}
                                                    type="text"
                                                    placeholder="0"
                                                    disabled
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            ))}
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
                                    <div className="p-6.5" key={field.id} hidden={index !== 0}>
                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            {viewMode !== "create" && (
                                                <div className="w-full">
                                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                        Chi nhánh
                                                    </label>
                                                    <input
                                                        {...register(`branchProducts.${index}.branch.branchName`)}
                                                        type="text"
                                                        disabled
                                                        className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Vị trí
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.storageLocation.shelfName`)}
                                                    type="text"
                                                    placeholder="Nhập vị trí"
                                                    disabled={viewMode === "details"}
                                                    className="w-full rounded border-1.5 border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.branchProducts?.[index]?.storageLocation?.shelfName && (
                                                    <span className="mt-1 block w-full text-sm text-rose-500">
                                                        {
                                                            errors.branchProducts?.[index]?.storageLocation.shelfName
                                                                .message
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-6 xl:flex-row">
                                            <div className="w-full xl:w-1/2">
                                                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                                    Định mức dưới
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.minQuantity`)}
                                                    type="number"
                                                    placeholder="Nhập định mức dưới"
                                                    disabled={viewMode === "details"}
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
                                                    Định mức trên
                                                </label>
                                                <input
                                                    {...register(`branchProducts.${index}.maxQuantity`)}
                                                    type="number"
                                                    placeholder="Nhập định mức trên"
                                                    disabled={viewMode === "details"}
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
                                    onClick={() => console.log(errors)}
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
                                    onClick={() => onOpenChange()}
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
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </form>
            </>
        );
    }
};

export default ProductForm;

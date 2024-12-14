import z from "zod";

const BranchProduct = z
    .object({
        id: z.coerce.string().trim().optional(),
        branch: z.object({
            id: z.coerce.string().trim().optional(),
            branchName: z.string().trim().optional(),
        }),
        storageLocation: z.object({ shelfName: z.string().trim().optional() }),
        minQuantity: z.coerce
            .number({ message: "Vui lòng nhập số" })
            .min(0, "Số lượng tối thiểu không thể nhỏ hơn 0")
            .max(10000000, "Số lượng tối thiểu không thể lớn hơn 10,000,000")
            .optional(),
        maxQuantity: z.coerce
            .number({ message: "Vui lòng nhập số" })
            .min(0, "Số lượng tối đa không thể nhỏ hơn 0")
            .max(10000000, "Số lượng tối đa không thể lớn hơn 10,000,000")
            .optional(),
        quantity: z.coerce.number({ message: "Vui lòng nhập số" }).optional(),
        productStatus: z.string().optional(),
    })
    .strict()
    .refine((data) => (data.minQuantity ?? 0) <= (data.maxQuantity ?? 0), {
        message: "Định mức trên phải lớn hơn định mức dưới",
        path: ["maxQuantity"], // Đặt thông báo lỗi tại vị trí maxQuantity
    });

const SpecialCondition = z
    .object({
        id: z.coerce.string().trim().optional(),
        conditionType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["NHIET_DO", "DO_AM", "ANH_SANG", "KHONG_KHI", "KHAC", ""], {
                required_error: "Vui lòng chọn điều kiện đặc biệt",
            })
        ),
        handlingInstruction: z.string().trim().min(1, "Vui lòng nhập hướng dẫn xử lý").max(255, "Giới hạn 255 kí tự"),
    })
    .strict();

const UnitConversion = z
    .object({
        id: z.coerce.string().trim().optional(),
        largerUnit: z.object({ id: z.coerce.string() }),
        smallerUnit: z.object({ id: z.coerce.string().min(1, "Vui lòng chọn đơn vị") }),
        factorConversion: z.coerce.number().min(0, "Giá trị quy đổi không thể nhỏ hơn 0"),
    })
    .strict();

export const ProductBody = z
    .object({
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(255, "Giới hạn 255 kí tự"),
        registrationCode: z.string().trim().min(1, "Vui lòng nhập mã đăng ký sản phẩm").max(255, "Giới hạn 255 kí tự"),
        urlImage: z.string().trim().optional(),
        activeIngredient: z.string().trim().min(1, "Vui lòng nhập hoạt chất").max(255, "Giới hạn 255 kí tự"),
        excipient: z.string().trim().max(255, "Giới hạn 255 kí tự").optional(),
        formulation: z.string().trim().min(1, "Vui lòng nhập bào chế").max(255, "Giới hạn 255 kí tự"),
        status: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["CON_HANG", "HET_HANG", "NGUNG_KINH_DOANH", ""], {
                required_error: "Vui lòng chọn trạng thái sản phẩm",
            })
        ),
        category: z.object({ id: z.coerce.string().trim().min(1, "Vui lòng chọn nhóm sản phẩm") }),
        type: z.object({ id: z.coerce.string().trim().min(1, "Vui lòng chọn loại sản phẩm") }),
        manufacturer: z.object({ id: z.coerce.string().trim().min(1, "Vui lòng chọn nhà sản xuất") }),
        unitConversions: z.array(UnitConversion).optional(),
        baseUnit: z.object({ id: z.coerce.string().trim().min(1, "Vui lòng chọn đơn vị") }),
        branchProducts: z.array(BranchProduct).optional(),
        specialConditions: z.array(SpecialCondition).optional(),
        inboundPrice: z.coerce
            .number()
            .min(0, "Giá không thể nhỏ hơn 0")
            .max(1000000000, "Giá không thể lớn hơn 1,000,000,000")
            .optional(),
        sellPrice: z.coerce
            .number()
            .min(0, "Giá không thể nhỏ hơn 0")
            .max(1000000000, "Giá không thể lớn hơn 1,000,000,000")
            .optional(),
    })
    .strict();

export type ProductBodyType = z.TypeOf<typeof ProductBody>;

export const BranchRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            branchName: z.string().trim().min(1).max(100),
            location: z.string().trim().max(255),
            contactPerson: z.string().trim().max(100),
            phoneNumber: z.string().trim().min(1).max(11),
            capacity: z.number(),
            activeStatus: z.boolean(),
            branchType: z.enum(["MAIN", "SUB"]),
        }),
    }),
    message: z.string(),
});

export type BranchResType = z.TypeOf<typeof BranchRes>;

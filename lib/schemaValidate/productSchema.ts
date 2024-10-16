import z from "zod";

const BranchProduct = z
    .object({
        branchId: z.string().trim(),
        storageLocation: z.string().trim(),
        minQuantity: z.coerce.number().optional(),
        maxQuantity: z.coerce.number().optional(),
        quantity: z.coerce.number().optional(),
    })
    .strict();

const SpecialCondition = z
    .object({
        conditionType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["NHIET_DO", "DO_AM", "ANH_SANG", "KHONG_KHI", "KHAC"], {
                required_error: "Vui lòng chọn điều kiện đặc biệt",
            })
        ),
        handlingInstruction: z.string().trim(),
    })
    .strict();

export const ProductBody = z
    .object({
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(256, "Giới hạn 255 kí tự"),
        productCode: z.string().trim().min(1, "Vui lòng nhập mã sản phẩm"),
        registrationCode: z.string().trim().min(1, "Vui lòng nhập mã đăng ký sản phẩm"),
        urlImage: z.string().trim().optional(),
        activeIngredient: z.string().trim().max(100, "Giới hạn 100 kí tự").optional(),
        excipient: z.string().trim(),
        formulation: z.string().trim(),
        status: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["CON_HANG", "HET_HANG", "NGUNG_KINH_DOANH"], {
                required_error: "Vui lòng chọn trạng thái sản phẩm",
            })
        ),
        branchProducts: z.array(BranchProduct),
        specialConditions: z.array(SpecialCondition),
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
            location: z.string().trim().max(256),
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

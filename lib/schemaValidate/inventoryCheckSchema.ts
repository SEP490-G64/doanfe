import z from "zod";

const BatchProduct = z
    .object({
        id: z.coerce.number().optional(),
        batchCode: z.string().trim().min(1, "Vui lòng nhập mã lô").max(100, "Giới hạn 100 ký tự").optional(),
        produceDate: z.coerce.string().trim().optional(),
        expireDate: z.coerce.string().trim().optional(),
        quantity: z.number().int().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        inventoryCheckPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        price: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        inboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        inventoryCheckBatchQuantity: z.number().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        inventoryCheckDetails: z.array(z.object({})).optional(),
        branchBatches: z.array(z.object({})).optional(),
        inventoryCheckBatchDetails: z.array(z.object({})).optional(),
    })
    .strict();

const ProductCheck = z
    .object({
        id: z.coerce.number().optional(),
        registrationCode: z.string().trim().optional(),
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự").optional(),
        product: z.object({
            id: z.number().optional(),
            productCode: z.string().trim().optional(),
            registrationCode: z.string().trim().optional(),
            productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự"),
        }),
        productBaseUnit: z.object({ id: z.number(), unitName: z.string() }).optional(),
        baseUnit: z.object({ id: z.number(), unitName: z.string() }).optional(),
        batches: z.array(BatchProduct).optional(),
        batch: BatchProduct.optional(),
        productUnits: z.array(z.object({ id: z.number(), unitName: z.string() })).optional(),
        systemQuantity: z.number().int().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        productQuantity: z.number().int().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        countedQuantity: z.number().int().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        difference: z.number().int().optional(),
        reason: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        inboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        sellPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        taxRate: z.number().optional(),
    })
    .strict();

export const CheckBody = z
    .object({
        inventoryCheckId: z.number().optional(),
        code: z.string().trim().optional(),
        createdDate: z.coerce.string(),
        note: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        createdBy: z.object({ id: z.number() }),
        branch: z.object({ id: z.coerce.number() }).optional(),
        inventoryCheckProductDetails: z.array(ProductCheck),
    })
    .strict();

export type CheckBodyType = z.TypeOf<typeof CheckBody>;
export type ProductCheckType = z.TypeOf<typeof ProductCheck>;

export const BranchDtoBody = z
    .object({
        id: z.coerce.number().int("Vui lòng chọn chi nhánh").min(1, "Vui lòng chọn chi nhánh"),
        branchName: z.string().optional(),
        location: z.string().optional(),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().optional(),
        capacity: z.coerce.number().int().optional(),
        activeStatus: z.boolean().optional(),
        branchType: z.enum(["MAIN", "SUB"]).optional(),
    })
    .strict();

export type BranchDtoType = z.TypeOf<typeof BranchDtoBody>;

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

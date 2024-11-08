import z from "zod";

const BatchProduct = z
    .object({
        batchCode: z.string().trim().min(1, "Vui lòng nhập mã lô").max(100, "Giới hạn 100 ký tự").optional(),
        produceDate: z.coerce.string().trim().optional(),
        expireDate: z.coerce.string().trim().optional(),
        outboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        outboundBatchQuantity: z.number().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        outboundDetails: z.array(z.object({})).optional(),
        branchBatches: z.array(z.object({})).optional(),
        outboundBatchDetails: z.array(z.object({})).optional(),
        inventoryCheckDetails: z.array(z.object({})).optional(),
    })
    .strict();

const ProductOutbound = z
    .object({
        id: z.number().optional(),
        productId: z.number().optional(),
        productCode: z.string().trim().optional(),
        registrationCode: z.string().trim().optional(),
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự"),
        discount: z.number().optional(),
        baseUnit: z.object({ id: z.number(), unitName: z.string() }),
        requestQuantity: z.number().int(),
        quantity: z.number().int().optional(),
        receiveQuantity: z.number().int().optional(),
        batches: z.array(BatchProduct).optional(),
        price: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
    })
    .strict();

export const OutboundBody = z
    .object({
        outboundId: z.number().optional(),
        outboundCode: z.string().trim().optional(),
        createdDate: z.coerce.string(),
        outboundType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["NHAP_TU_NHA_CUNG_CAP", "CHUYEN_KHO_NOI_BO"], {
                required_error: "Vui lòng chọn kiểu nhập hàng",
            })
        ),
        note: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        createdBy: z.object({ id: z.number() }),
        supplier: z.object({ id: z.coerce.string().trim() }).optional(),
        fromBranch: z.object({ id: z.coerce.string().trim() }).optional(),
        toBranch: z.object({ id: z.number() }).optional(),
        outboundProductDetails: z.array(ProductOutbound),
    })
    .strict();

export type OutboundBodyType = z.TypeOf<typeof OutboundBody>;
export type ProductOutboundType = z.TypeOf<typeof ProductOutbound>;

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

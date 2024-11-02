import z from "zod";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7, 8}))$/;

const BatchProduct = z
    .object({
        batchCode: z.string().trim().min(1, "Vui lòng nhập mã lô").max(100, "Giới hạn 100 ký tự").optional(),
        produceDate: z.coerce.string().trim().optional(),
        expireDate: z.coerce.string().trim().optional(),
        inboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        inboundBatchQuantity: z.number().min(0, "Số lượng không thể nhỏ hơn 0").optional(),
        outboundDetails: z.array(z.object({})).optional(),
        branchBatches: z.array(z.object({})).optional(),
        inboundBatchDetails: z.array(z.object({})).optional(),
        inventoryCheckDetails: z.array(z.object({})).optional(),
    })
    .strict();

const ProductInbound = z
    .object({
        id: z.number().optional(),
        productId: z.number().optional(),
        productCode: z.string().trim().optional(),
        registrationCode: z.string().trim().optional(),
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự"),
        discount: z.number().optional(),
        baseUnit: z.object({ id: z.number(), unitName: z.string() }),
        batchList: z.array(BatchProduct).optional(),
        requestQuantity: z.number().int(),
        quantity: z.number().int().optional(),
        receiveQuantity: z.number().int().optional(),
        batches: z.array(BatchProduct).optional(),
        price: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
    })
    .strict();

export const InboundBody = z
    .object({
        inboundId: z.number().optional(),
        inboundCode: z.string().trim().optional(),
        createdDate: z.coerce.string(),
        inboundType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["NHAP_TU_NHA_CUNG_CAP", "CHUYEN_KHO_NOI_BO"], {
                required_error: "Vui lòng chọn kiểu nhập hàng",
            })
        ),
        note: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        createdBy: z.object({ id: z.number() }),
        supplier: z.object({ id: z.coerce.string().trim().min(1, "Vui lòng chọn cung cấp") }),
        fromBranch: z.object({ id: z.number() }).optional(),
        toBranch: z.object({ id: z.number() }).optional(),
        productInbounds: z.array(ProductInbound),
    })
    .strict();

export type InboundBodyType = z.TypeOf<typeof InboundBody>;
export type ProductInboundType = z.TypeOf<typeof ProductInbound>;

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

import z from "zod";

const BatchProduct = z
    .object({
        id: z.coerce.number().optional(),
        batchCode: z.string().trim().min(1, "Vui lòng nhập mã lô").max(100, "Giới hạn 100 ký tự").optional(),
        produceDate: z.coerce.string().trim().optional(),
        expireDate: z.coerce.string().trim().optional(),
        outboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        price: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        inboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        outboundBatchQuantity: z.number().optional(),
        outboundDetails: z.array(z.object({})).optional(),
        branchBatches: z.array(z.object({})).optional(),
        outboundBatchDetails: z.array(z.object({})).optional(),
        inventoryCheckDetails: z.array(z.object({})).optional(),
        quantity: z.number().optional(),
        preQuantity: z.number().min(1).optional(),
        batchQuantity: z.number().min(0).optional(),
    })
    .strict()
    .refine(
        (data) => {
            if (!data.preQuantity) return true; // Không cần kiểm tra nếu `preQuantity` không có
            if (data.batchQuantity === undefined || data.batchQuantity === null) {
                return false; // Nếu không có `batchQuantity`, không hợp lệ
            }
            return data.preQuantity <= data.batchQuantity; // Kiểm tra logic
        },
        {
            message: "preQuantity phải nhỏ hơn hoặc bằng batchQuantity và batchQuantity phải có giá trị",
            path: ["preQuantity"], // Gán lỗi này cho trường `preQuantity`
        }
    );

const ProductOutbound = z
    .object({
        id: z.coerce.number().optional(),
        urlImage: z.string().trim().optional(),
        registrationCode: z.string().trim().optional(),
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự").optional(),
        product: z.object({
            id: z.number().optional(),
            productCode: z.string().trim().optional(),
            registrationCode: z.string().trim().optional(),
            productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự"),
            batches: z.array(BatchProduct).optional(),
        }),
        productBaseUnit: z.object({ id: z.number(), unitName: z.string() }),
        baseUnit: z.object({ id: z.number(), unitName: z.string() }).optional(),
        targetUnit: z.object({ id: z.number().optional(), unitName: z.string().trim().optional() }).optional(),
        batches: z.array(BatchProduct).optional(),
        batch: BatchProduct.optional(),
        productUnits: z
            .array(z.object({ id: z.number(), unitName: z.string(), productUnitQuantity: z.number() }))
            .optional(),
        price: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        inboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        sellPrice: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        outboundQuantity: z
            .number()
            .min(0, "Số lượng yêu cầu không thể nhỏ hơn 0")
            .max(10000, "Số lượng yêu cầu không thể lớn hơn 10,000")
            .optional(),
        productQuantity: z.number().optional(),
        taxRate: z.number().min(0, "Thuế không âm").max(150, "Thuế không vượt quá 150").optional(),
        batchQuantity: z.number().min(0).optional(),
        preQuantity: z.number().min(1, "Số lượng xuất không được nhỏ hơn 1").optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        // Kiểm tra trường hợp `preQuantity` phải nhỏ hơn hoặc bằng `batchQuantity`
        if (data.preQuantity && data.batchQuantity !== undefined && data.preQuantity > data.batchQuantity) {
            ctx.addIssue({
                path: ["preQuantity"], // Gán lỗi vào trường preQuantity
                code: z.ZodIssueCode.custom,
                message: "Số lượng xuất phải <= số lượng tồn kho",
            });
        }
    });

export const OutboundBody = z
    .object({
        outboundId: z.number().optional(),
        outboundCode: z.string().trim().optional(),
        createdDate: z.coerce.string(),
        outboundType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["HUY_HANG", "CHUYEN_KHO_NOI_BO", "TRA_HANG", "BAN_HANG"], {
                required_error: "Vui lòng chọn kiểu xuất hàng",
            })
        ),
        note: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        createdBy: z.object({ id: z.number() }),
        supplier: z.object({ id: z.coerce.string().trim() }).optional(),
        toBranch: z.object({ id: z.coerce.string().trim() }).optional(),
        fromBranch: z.object({ id: z.number() }).optional(),
        outboundProductDetails: z.array(ProductOutbound),
        approvedBy: z.object({ id: z.number().optional() }).optional(),
        isApproved: z.boolean().optional(),
        taxable: z.boolean().optional(),
        totalPrice: z.string().optional(),
        status: z.string().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        // Kiểm tra từng ProductOutbound dựa trên status
        if (data.status === "KIEM_HANG") {
            data.outboundProductDetails.forEach((product, index) => {
                if (product.preQuantity && (product.outboundQuantity === undefined || product.outboundQuantity < 0)) {
                    ctx.addIssue({
                        path: ["outboundProductDetails", index, "outboundQuantity"], // Gán lỗi vào field cụ thể
                        code: z.ZodIssueCode.custom,
                        message: "Số lượng xuất phải >= 0",
                    });
                }
            });
        }

        if (data.outboundType !== "BAN_HANG") {
            data.outboundProductDetails.forEach((product, index) => {
                if (product.preQuantity! < 1) {
                    ctx.addIssue({
                        path: ["outboundProductDetails", index, "preQuantity"], // Gán lỗi vào field cụ thể
                        code: z.ZodIssueCode.custom,
                        message: "Số lượng xuất phải >= 1",
                    });
                }
            });
            data.outboundProductDetails.forEach((product, index) => {
                if (product.preQuantity == undefined) {
                    ctx.addIssue({
                        path: ["outboundProductDetails", index, "preQuantity"], // Gán lỗi vào field cụ thể
                        code: z.ZodIssueCode.custom,
                        message: "Nếu chưa chọn lô thì ô này không sửa được. Số lượng yêu cầu không được để trống",
                    });
                }
            });
        } else {
            data.outboundProductDetails.forEach((product, index) => {
                if (product.outboundQuantity == undefined) {
                    ctx.addIssue({
                        path: ["outboundProductDetails", index, "outboundQuantity"], // Gán lỗi vào field cụ thể
                        code: z.ZodIssueCode.custom,
                        message: "Nếu chưa chọn đơn vị xuất thì ô này không sửa được. Số lượng bán không được để trống",
                    });
                }
            });
            data.outboundProductDetails.forEach((product, index) => {
                if (product.outboundQuantity! <= 0) {
                    ctx.addIssue({
                        path: ["outboundProductDetails", index, "outboundQuantity"], // Gán lỗi vào field cụ thể
                        code: z.ZodIssueCode.custom,
                        message: "Số lượng bán phải > 0",
                    });
                }
            });
        }

        // Nếu outboundType là TRA_HANG thì supplier.id là bắt buộc
        if (data.outboundType === "TRA_HANG" && !data.supplier?.id) {
            ctx.addIssue({
                path: ["supplier", "id"],
                code: z.ZodIssueCode.custom,
                message: "Vui lòng chọn nhà cung cấp",
            });
        }
        // Nếu outboundType là CHUYEN_KHO_NOI_BO thì fromBranch.id là bắt buộc
        if (data.outboundType === "CHUYEN_KHO_NOI_BO" && !data.toBranch?.id) {
            ctx.addIssue({
                path: ["toBranch", "id"],
                code: z.ZodIssueCode.custom,
                message: "Vui lòng chọn chi nhánh nhận hàng",
            });
        }
    });

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

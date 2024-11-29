import { z } from "zod";

// Hàm kiểm tra ngày hết hạn
const isValidExpireDate = (expireDate: string) => {
    const currentDate = new Date();
    const expireDateObj = new Date(expireDate);
    const tenYearsLater = new Date(currentDate.getFullYear() + 10, currentDate.getMonth(), currentDate.getDate());

    // Kiểm tra nếu expireDate hợp lệ
    return expireDateObj >= currentDate && expireDateObj <= tenYearsLater;
};

// Cập nhật schema BatchProduct
const BatchProduct = z
    .object({
        id: z.number().optional(),
        batchCode: z.string().trim().max(100, "Giới hạn 100 ký tự").optional(),
        produceDate: z.coerce.string().trim().optional(),
        expireDate: z.coerce.string().trim().optional(),
        inboundPrice: z.number().min(0, "Giá không thể nhỏ hơn 0"),
        inboundBatchQuantity: z.number().min(0, "Số lượng không thể nhỏ hơn 0"),
        outboundDetails: z.array(z.object({})).optional(),
        branchBatches: z.array(z.object({})).optional(),
        inboundBatchDetails: z.array(z.object({})).optional(),
        inventoryCheckDetails: z.array(z.object({})).optional(),
        quantity: z.number().max(10000, "Không được quá 10,000").optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        // Kiểm tra expireDate hợp lệ (không nhỏ hơn ngày hiện tại và không quá 10 năm)
        if (
            data.expireDate &&
            data.expireDate !== "" &&
            data.expireDate !== undefined &&
            !isValidExpireDate(data.expireDate)
        ) {
            ctx.addIssue({
                path: ["expireDate"],
                message: "Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại và không vượt quá 10 năm.",
                code: z.ZodIssueCode.custom,
            });
        }

        // Kiểm tra nếu batchCode có giá trị mà lại không có expireDate
        if (data.batchCode?.trim() && !data.expireDate) {
            ctx.addIssue({
                path: ["expireDate"],
                message: "Ngày hết hạn không thể rỗng nếu có batch code.",
                code: z.ZodIssueCode.custom,
            });
        }
    });

const ProductInbound = z
    .object({
        id: z.number().optional(),
        productId: z.number().optional(),
        productCode: z.string().trim().optional(),
        registrationCode: z.string().trim().optional(),
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(100, "Giới hạn 100 kí tự"),
        discount: z.number().optional(),
        taxRate: z.number().optional(),
        productBaseUnit: z.object({ id: z.number(), unitName: z.string() }).optional(),
        baseUnit: z.object({ id: z.number(), unitName: z.string() }).optional(),
        requestQuantity: z
            .number({ message: "Số lượng yêu cầu không hợp lệ" })
            .min(1, "Số lượng yêu cầu không thể nhỏ hơn 1")
            .max(10000, "Số lượng yêu cầu không thể lớn hơn 10,000")
            .optional() // Make the field optional
            .refine((value) => value !== undefined && value !== null && value !== 0, {
                message: "Số lượng không được bỏ trống", // Thông báo tùy chỉnh khi không điền giá trị
            }),
        quantity: z.number().int().optional(),
        receiveQuantity: z.number().int().max(10000, "Không được quá 10,000").optional(),
        productQuantity: z.number().int().optional(),
        batches: z.array(BatchProduct).optional(),
        price: z.number().min(0, "Giá không thể nhỏ hơn 0").optional(),
        inboundPrice: z.number().optional(),
        sellPrice: z.number().optional(),
        productUnits: z.array(z.object({ id: z.number(), unitName: z.string() })).optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        // Kiểm tra nếu có nhiều hơn 1 batch
        if (data.batches && data.batches.length > 1) {
            // Duyệt qua từng batch và kiểm tra điều kiện
            data.batches.forEach((batch, index) => {
                // Kiểm tra nếu batch.batchCode là chuỗi hợp lệ
                const batchCodeValid = batch.batchCode && batch.batchCode.trim().length > 0;

                // Kiểm tra nếu expireDate hợp lệ
                const expireDateValid = batch.expireDate ? isValidExpireDate(batch.expireDate) : true;

                // Kiểm tra batchCode
                if (!batchCodeValid) {
                    ctx.addIssue({
                        path: ["batches", index, "batchCode"],
                        message: "Batch code phải có ít nhất 1 ký tự nếu có nhiều hơn 1 batch.",
                        code: z.ZodIssueCode.custom,
                    });
                }

                // Kiểm tra expireDate
                if (batch.expireDate && !expireDateValid) {
                    ctx.addIssue({
                        path: ["batches", index, "expireDate"],
                        message: "Ngày hết hạn phải lớn hơn hoặc bằng ngày hiện tại và không vượt quá 10 năm.",
                        code: z.ZodIssueCode.custom,
                    });
                }
            });
        }
    });

// Cập nhật schema cho InboundBody
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
        supplier: z.object({ id: z.coerce.string().trim() }).optional(),
        fromBranch: z.object({ id: z.coerce.string().trim() }).optional(),
        toBranch: z.object({ id: z.number() }).optional(),
        productInbounds: z.array(ProductInbound),
        approvedBy: z.object({ id: z.number().optional() }).optional(),
        isApproved: z.boolean().optional(),
        taxable: z.boolean().optional(),
        totalPrice: z.string().optional(),
    })
    .strict()
    .superRefine((data, ctx) => {
        // Kiểm tra các điều kiện giống như trong code trước
        // Nếu inboundType là NHAP_TU_NHA_CUNG_CAP thì supplier.id là bắt buộc
        if (data.inboundType === "NHAP_TU_NHA_CUNG_CAP" && !data.supplier?.id) {
            ctx.addIssue({
                path: ["supplier", "id"],
                code: z.ZodIssueCode.custom,
                message: "Vui lòng chọn nhà cung cấp",
            });
        }
        // Nếu inboundType là CHUYEN_KHO_NOI_BO thì fromBranch.id là bắt buộc
        if (data.inboundType === "CHUYEN_KHO_NOI_BO" && !data.fromBranch?.id) {
            ctx.addIssue({
                path: ["fromBranch", "id"],
                code: z.ZodIssueCode.custom,
                message: "Vui lòng chọn chi nhánh xuất",
            });
        }
        // Nếu bạn muốn bỏ qua lỗi batches khi không có dữ liệu
        data.productInbounds.forEach((product, idx) => {
            if (product.batches?.length === 0) {
                product.batches = [];
            }
        });
    });

// Export các type để sử dụng trong code
export type InboundBodyType = z.TypeOf<typeof InboundBody>;
export type ProductInboundType = z.TypeOf<typeof ProductInbound>;

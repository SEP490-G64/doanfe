import z from "zod";

const Product = z
    .object({
        id: z.string(),
        productName: z.string(),
    })
    .strict();

export const BatchBody = z
    .object({
        batchCode: z.string().trim().min(1, "Vui lòng nhập mã lô").max(100, "Giới hạn 100 kí tự"),
        produceDate: z.string().datetime({ message: "Ngày sản xuất không hợp lệ" }).optional(),
        expireDate: z
            .string()
            .min(1, "Ngày hết hạn không đươc bỏ trống")
            .datetime({ message: "Ngày hết hạn không hợp lệ" }),
        inboundPrice: z.coerce
            .number({ message: "Vui lòng nhập số" })
            .min(1, "Giá nhập phải lớn hơn 0")
            .max(10000000, "Giá nhập không thể lớn hơn 10,000,000")
            .optional(),
        product: Product,
    })
    .strict()
    .superRefine((data, ctx) => {
        const { produceDate, expireDate } = data;
        if (produceDate && expireDate && new Date(expireDate) <= new Date(produceDate)) {
            ctx.addIssue({
                code: "custom",
                path: ["expireDate"],
                message: "Ngày hết hạn phải lớn hơn ngày sản xuất",
            });
        }
    });

export type BatchBodyType = z.TypeOf<typeof BatchBody>;

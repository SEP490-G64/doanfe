import z from "zod";

const Product = z
    .object({
        id: z.number(),
        productName: z.string().optional(),
        registrationCode: z.string().optional(),
        activeIngredient: z.string().optional(),
        excipient: z.string().optional(),
        formulation: z.string().optional(),
        inboundPrice: z.number().optional(),
        sellPrice: z.number().optional(),
        status: z.string().optional(),
        baseUnit: z.object({ id: z.number().optional() }).optional(),
    })
    .strict();

export const BatchBody = z
    .object({
        batchCode: z.string().trim().min(1, "Vui lòng nhập mã lô").max(100, "Giới hạn 100 kí tự"),
        produceDate: z
            .string()
            .refine((value) => !value || !isNaN(new Date(value).getTime()), "Ngày sản xuất không hợp lệ") // Cho phép bỏ trống hoặc kiểm tra tính hợp lệ
            .optional() // Trường này được phép bỏ trống
            .refine((value) => {
                if (value) {
                    const date = new Date(value);
                    return date >= new Date("2000-01-01"); // Ngày sản xuất phải sau hoặc bằng 01/01/2000
                }
                return true; // Nếu trường trống, bỏ qua kiểm tra
            }, "Ngày sản xuất phải sau hoặc bằng 01/01/2000"),
        expireDate: z
            .string()
            .min(1, "Ngày hết hạn không được bỏ trống") // Kiểm tra trường hợp trống
            .refine((value) => !isNaN(new Date(value).getTime()), "Ngày hết hạn không hợp lệ") // Kiểm tra tính hợp lệ của ngày hết hạn
            .refine((value) => {
                const date = new Date(value);
                const maxExpireDate = new Date();
                maxExpireDate.setFullYear(maxExpireDate.getFullYear() + 10); // Ngày hết hạn phải trước hoặc bằng ngày hiện tại + 10 năm
                return date <= maxExpireDate;
            }, "Ngày hết hạn phải trước hoặc bằng ngày hiện tại cộng thêm 10 năm"),
        inboundPrice: z.coerce
            .number()
            .min(0, "Giá không thể nhỏ hơn 0")
            .max(10000000, "Giá không thể lớn hơn 10,000,000")
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
                message: "Ngày hết hạn phải sau ngày sản xuất",
            });
        }
        if (produceDate && expireDate && new Date(expireDate) <= new Date(produceDate)) {
            ctx.addIssue({
                code: "custom",
                path: ["produceDate"],
                message: "Ngày sản xuất phải trước ngày hết hạn",
            });
        }
    });

export type BatchBodyType = z.TypeOf<typeof BatchBody>;

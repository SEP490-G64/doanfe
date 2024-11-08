import z from "zod";

export const CategoryBody = z
    .object({
        categoryName: z.string().trim().min(1, "Vui lòng nhập tên nhóm sản phẩm").max(100, "Giới hạn 100 kí tự"),
        categoryDescription: z.string().trim().max(1000, "Giới hạn 1000 kí tự").optional(),
        taxRate: z.coerce
            .number({ message: "Vui lòng nhập số" })
            .min(0, "Phần trăm thuế không thể âm")
            .max(100, "Phần trăm thuế không thể lớn hơn 100")
            .optional(),
    })
    .strict();

export type CategoryBodyType = z.TypeOf<typeof CategoryBody>;

export const CategoryRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            categoryName: z.string().trim().min(1).max(100),
            categoryDescription: z.string().trim().max(1000),
            taxRate: z.number(),
        }),
    }),
    message: z.string(),
});

export type CategoryResType = z.TypeOf<typeof CategoryRes>;

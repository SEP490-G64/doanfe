import z from "zod";

export const TypeBody = z
    .object({
        typeName: z.string().trim().min(1, "Vui lòng nhập tên loại sản phẩm").max(100, "Giới hạn 100 kí tự"),
        typeDescription: z.string().trim().max(500, "Giới hạn 500 kí tự").optional(),
    })
    .strict();

export type TypeBodyType = z.TypeOf<typeof TypeBody>;

export const TypeRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            typeName: z.string().trim().min(1).max(100),
            typeDescription: z.string().trim().max(1000),
        }),
    }),
    message: z.string(),
});

export type TypeResType = z.TypeOf<typeof TypeRes>;

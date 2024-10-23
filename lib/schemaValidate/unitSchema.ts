import z from "zod";

export const UnitBody = z
    .object({
        unitName: z.string().trim().min(1, "Vui lòng nhập tên đơn vị").max(100, "Giới hạn 100 kí tự"),
    })
    .strict();

export type UnitBodyType = z.TypeOf<typeof UnitBody>;

export const UnitRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            unitName: z.string().trim().min(1).max(100),
        }),
    }),
    message: z.string(),
});

export type UnitResType = z.TypeOf<typeof UnitRes>;

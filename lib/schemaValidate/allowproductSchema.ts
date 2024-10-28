import z from "zod";

export const AllowProductRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            productName: z.string().trim(),
            productCode: z.string().trim(),
            registrationCode: z.string().trim(),
            urlImage: z.string().trim(),
            activeIngredient: z.string().trim(),
            excipient: z.string().trim(),
            formulation: z.string().trim(),
        }),
    }),
    message: z.string(),
});

export type AllowProductResType = z.TypeOf<typeof AllowProductRes>;

import z from "zod";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7, 8}))$/;
// Biểu thức chính quy cho mã số thuế tại Việt Nam
const taxCodeRegex = /^(0[0-9]{9}|[1-9][0-9]{9}|[1-9][0-9]{13})$/;

export const ManufacturerBody = z
    .object({
        manufacturerName: z.string().trim().min(1, "Vui lòng nhập tên nhà sản xuất").max(100, "Giới hạn 100 kí tự"),
        address: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        email: z
            .string()
            .trim()
            .optional()
            .refine((value) => value === undefined || value.trim().length === 0 || /^\S+@\S+\.\S+$/.test(value), {
                message: "Email không đúng định dạng",
            }), // Kiểm tra định dạng email, bỏ qua nếu trống
        phoneNumber: z
            .string()
            .trim()
            .max(11, "Giới hạn 11 kí tự")
            .optional()
            .refine((value) => value === undefined || value.trim().length === 0 || phoneNumberRegex.test(value), {
                message: "Số điện thoại không đúng định dạng",
            }),
        taxCode: z
            .string()
            .trim()
            .max(14, "Giới hạn 14 kí tự")
            .optional()
            .refine((value) => value === undefined || value.trim().length === 0 || taxCodeRegex.test(value), {
                message: "Mã số thuế không đúng định dạng",
            }), // Kiểm tra mã số thuế
        origin: z.string().trim().min(1, "Vui lòng chọn nguồn gốc"),
        status: z.boolean(),
    })
    .strict();

export type ManufacturerBodyType = z.TypeOf<typeof ManufacturerBody>;

// Đối tượng phản hồi
export const ManufacturerRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            manufacturerName: z.string().trim().min(1).max(100),
            address: z.string().trim().min(1).max(256),
            email: z.string().email(),
            phoneNumber: z.string().trim().max(11),
            taxCode: z.string().trim().max(14),
            origin: z.string().trim().min(1),
            status: z.boolean(),
        }),
    }),
    message: z.string(),
});

export type ManufacturerResType = z.TypeOf<typeof ManufacturerRes>;

import z from "zod";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex =
    /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7,8}|(0[2-9]\d{7, 8}))$/;

export const BranchBody = z
    .object({
        branchName: z.string().trim().min(1, "Vui lòng nhập tên chi nhánh").max(100, "Giới hạn 100 kí tự"),
        location: z.string().trim().min(1, "Vui lòng nhập địa chỉ chi nhánh").max(255, "Giới hạn 255 kí tự"),
        contactPerson: z.string().trim().max(100, "Giới hạn 100 kí tự").optional(),
        phoneNumber: z
            .string()
            .trim()
            .min(1, "Vui lòng nhập số điện thoại liên hệ")
            .max(11, "Giới hạn 11 kí tự")
            .regex(phoneNumberRegex, "Số điện thoại không đúng định dạng"), // Kiểm tra định dạng,
        capacity: z.coerce
            .number({ message: "Vui lòng nhập số" })
            .int("Vui lòng nhập số nguyên")
            .min(1, "Quy mô chi nhánh không thể nhỏ hơn 1")
            .max(100000, "Quy mô chi nhánh không thể lớn hơn 100,000")
            .optional(),
        activeStatus: z.boolean(),
        // Use preprocess to handle null/undefined
        branchType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["MAIN", "SUB"], {
                required_error: "Vui lòng chọn kiểu chi nhánh",
            })
        ),
    })
    .strict();

export type BranchBodyType = z.TypeOf<typeof BranchBody>;

export const BranchDtoBody = z
    .object({
        id: z.coerce.number().int("Vui lòng chọn chi nhánh").min(1, "Vui lòng chọn chi nhánh"),
        branchName: z.string().optional(),
        location: z.string().optional(),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().optional(),
        capacity: z.string().optional(),
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
            location: z.string().trim().max(255),
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

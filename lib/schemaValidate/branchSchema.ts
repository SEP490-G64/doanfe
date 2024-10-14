import z from "zod";

export const BranchBody = z
    .object({
        branchName: z.string().trim().min(1, "Vui lòng nhập tên chi nhánh").max(256, "Giới hạn 255 kí tự"),
        location: z.string().trim().min(1, "Vui lòng nhập địa chỉ chi nhánh").max(256, "Giới hạn 255 kí tự"),
        contactPerson: z.string().trim().max(256, "Giới hạn 255 kí tự").optional(),
        phoneNumber: z.string().trim().min(1, "Vui lòng nhập số điện thoại liên hệ").max(50, "Giới hạn 50 kí tự"),
        capacity: z.coerce.number({ message: "Vui lòng nhập số" }).int("Vui lòng nhập số nguyên").optional(),
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

export const BranchRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            branchName: z.string().trim().min(2).max(256),
            location: z.string().trim().max(256),
            contactPerson: z.string().trim().max(256),
            phoneNumber: z.string().trim().min(6).max(50),
            capacity: z.number(),
            activeStatus: z.boolean(),
            branchType: z.enum(["MAIN", "SUB"]),
        }),
    }),
    message: z.string(),
});

export type BranchResType = z.TypeOf<typeof BranchRes>;

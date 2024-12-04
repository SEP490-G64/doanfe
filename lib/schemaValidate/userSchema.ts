import z from "zod";
import RoleBody from "./roleSchema";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex =
    /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7,8}|(0[2-9]\d{7, 8}))$/;

export const BranchDtoBody = z
    .object({
        id: z.coerce.number(),
        branchName: z.string().optional(),
        location: z.string().optional(),
        contactPerson: z.string().optional(),
        phoneNumber: z.string().optional(),
        capacity: z.number().optional(),
        activeStatus: z.boolean().optional(),
        branchType: z.string().optional(),
        isDeleted: z.boolean().optional(),
    })
    .strict();

export const UserBody = z
    .object({
        userName: z
            .string()
            .trim()
            .min(5, "Tên người dùng phải có ít nhất 5 kí tự")
            .max(20, "Tên người dùng không quá 20 kí tự"),
        email: z.string().email("Email không đúng định dạng"),
        firstName: z.string().max(255, "Họ không quá 255 kí tự").optional(),
        lastName: z.string().max(255, "Tên không quá 255 kí tự").optional(),
        phone: z
            .string()
            .trim()
            .max(11, "Giới hạn 11 kí tự")
            .optional()
            .refine((value) => value === undefined || value.trim().length === 0 || phoneNumberRegex.test(value), {
                message: "Số điện thoại không đúng định dạng",
            }),
        branch: BranchDtoBody,
        roles: z.array(RoleBody).min(1, "Phải có ít nhất một vai trò"),
        status: z.string(),
    })
    .strict();

export type UserBodyType = z.TypeOf<typeof UserBody>;

// Đối tượng phản hồi
export const UserRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            userName: z.string().min(5).max(20),
            email: z.string().email(),
            phone: z.string().max(11),
            firstName: z.string().max(255),
            lastName: z.string().max(255),
            status: z.string(),
            roles: z
                .array(
                    z.object({
                        id: z.coerce.number(),
                        name: z.string(),
                        type: z.string(),
                    })
                )
                .optional(),
            branch: BranchDtoBody.optional(),
        }),
    }),
    message: z.string(),
});

export type UserResType = z.TypeOf<typeof UserRes>;

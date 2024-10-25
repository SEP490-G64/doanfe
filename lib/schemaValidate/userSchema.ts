import z from "zod";
import { BranchBody, BranchDtoBody } from "./branchSchema";
import RoleBody from "./roleSchema";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7, 8}))$/;

export const UserBody = z
    .object({
        userName: z
            .string()
            .trim()
            .min(1, "Tên người dùng không được để trống")
            .max(100, "Tên người dùng không quá 256 kí tự"),
        email: z.string().email("Email không đúng định dạng"),
        firstName: z.string().max(256, "Họ không quá 256 kí tự").optional(),
        lastName: z.string().max(256, "Tên không quá 256 kí tự").optional(),
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
            userName: z.string().min(1).max(100),
            email: z.string().email(),
            phone: z.string().max(11),
            firstName: z.string().max(256),
            lastName: z.string().max(256),
            status: z.string().max(256),
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
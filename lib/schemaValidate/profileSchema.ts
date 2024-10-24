import z from "zod";
import { BranchBody } from "@/lib/schemaValidate/branchSchema";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7}))$/;

export const ProfileBody = z
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
        roles: z
            .array(
                z.object({
                    name: z.string(),
                    type: z.string(),
                })
            )
            .optional(),
        branch: BranchBody.optional(),
    })
    .strict();

export type ProfileBodyType = z.TypeOf<typeof ProfileBody>;

// Đối tượng phản hồi
export const ProfileRes = z.object({
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
        }),
    }),
    message: z.string(),
});

export type ProfileType = z.TypeOf<typeof ProfileRes>;

export const ChangePasswordBody = z
    .object({
        oldPassword: z.string().min(6, "Mật khẩu tối thiểu gồm 6 kí tự").max(100, "Mật khẩu không quá 100 kí tự"),
        newPassword: z.string().min(6, "Mật khẩu tối thiểu gồm 6 kí tự").max(100, "Mật khẩu không quá 100 kí tự"),
        confirmPassword: z.string().min(6, "Mật khẩu tối thiểu gồm 6 kí tự").max(100, "Mật khẩu không quá 100 kí tự"),
    })
    .strict()
    .superRefine(({ confirmPassword, newPassword }, ctx) => {
        if (confirmPassword !== newPassword) {
            ctx.addIssue({
                code: "custom",
                message: "Mật khẩu không khớp",
                path: ["confirmPassword"],
            });
        }
    });

export type ChangePasswordBodyType = z.TypeOf<typeof ChangePasswordBody>;

// Đối tượng phản hồi
export const ChangePasswordRes = z.object({
    message: z.string(),
});

export type ChangePasswordType = z.TypeOf<typeof ChangePasswordRes>;

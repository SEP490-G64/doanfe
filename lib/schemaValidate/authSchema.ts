import z from "zod";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7}))$/;

export const RegisterBody = z
    .object({
        username: z
            .string()
            .trim()
            .min(1, "Tên người dùng không được để trống")
            .max(100, "Tên người dùng không quá 256 kí tự"),
        email: z.string().email("Email không đúng định dạng"),
        firstName: z.string().max(256, "Họ không quá 256 kí tự"),
        lastName: z.string().max(256, "Tên không quá 256 kí tự"),
        phone: z
            .string()
            .trim()
            .max(11, "Giới hạn 11 kí tự")
            .optional()
            .refine((value) => value === undefined || value.trim().length === 0 || phoneNumberRegex.test(value), {
                message: "Số điện thoại không đúng định dạng",
            }),
        password: z.string().min(6, "Mật khẩu tối thiểu gồm 6 kí tự").max(100, "Mật khẩu không quá 100 kí tự"),
        confirmPassword: z.string().min(6, "Mật khẩu tối thiểu gồm 6 kí tự").max(100, "Mật khẩu không quá 100 kí tự"),
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "Mật khẩu không khớp",
                path: ["confirmPassword"],
            });
        }
    });

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>;

export const RegisterRes = z.object({
    data: z.object({
        token: z.string(),
        expiresAt: z.string(),
        account: z.object({
            id: z.number(),
            username: z.string().min(1).max(100),
            email: z.string().email(),
            phone: z.string().max(11),
            firstName: z.string().max(256),
            lastName: z.string().max(256),
            password: z.string().min(6).max(100),
            confirmPassword: z.string().min(6).max(100),
        }),
    }),
    message: z.string(),
});

export type RegisterResType = z.TypeOf<typeof RegisterRes>;

export const LoginBody = z
    .object({
        email: z.string().email("Email không phù hợp"),
        password: z.string().min(6, "Mật khẩu tối thiểu gồm 6 kí tự").max(100),
    })
    .strict();

export type LoginBodyType = z.TypeOf<typeof LoginBody>;

export const ForgotPasswordBody = z
    .object({
        email: z.string().email("Email không đúng định dạng"),
    })
    .strict();

export type ForgotPasswordType = z.TypeOf<typeof ForgotPasswordBody>;

export const LoginRes = RegisterRes;

export type LoginResType = z.TypeOf<typeof LoginRes>;
export const SlideSessionBody = z.object({}).strict();

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>;
export const SlideSessionRes = RegisterRes;

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>;

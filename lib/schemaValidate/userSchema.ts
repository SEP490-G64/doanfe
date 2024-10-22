import z from "zod";
import { BranchBody } from "./branchSchema";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7}))$/;

export const UserBody = z
    .object({
        userName: z.string().trim().min(1, "Vui lòng nhập tên nhà cung cấp").max(100, "Giới hạn 100 kí tự"),
        password: z.string().trim().min(1, "Vui lòng nhập địa chỉ nhà cung cấp").max(256, "Giới hạn 255 kí tự"),
        email: z
            .string()
            .trim()
            .optional()
            .refine((value) => value === undefined || value.trim().length === 0 || /^\S+@\S+\.\S+$/.test(value), {
                message: "Email không đúng định dạng",
            }), // Kiểm tra định dạng email, bỏ qua nếu trống
        phone: z
            .string()
            .trim()
            .min(1, "Vui lòng nhập số điện thoại liên hệ")
            .max(11, "Giới hạn 11 kí tự")
            .regex(phoneNumberRegex, "Số điện thoại không đúng định dạng"),
        firstName: z.string().trim().max(14, "Giới hạn 14 kí tự").optional(),
        lastName: z.string().trim().max(20, "Giới hạn 20 kí tự").optional(),
        branch: BranchBody.optional(),
        roles: z
            .array(
                z.object({
                    name: z.string(),
                    type: z.string(),
                })
            )
            .optional(),
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
            userName: z.string().trim().min(1).max(100),
            email: z.string().email(),
            password: z.string().trim().min(8).max(256),
            phone: z.string().trim().min(1).max(11),
            firstName: z.string().trim().min(1).max(256),
            lastName: z.string().trim().max(14),
            createdTime: z.string().trim().max(20),
            status: z.string(),
            roles: z
                .array(
                    z.object({
                        name: z.string(),
                        type: z.string(),
                    })
                )
                .optional(),
            branch: BranchBody.optional(),
        }),
    }),
    message: z.string(),
});

export type UserResType = z.TypeOf<typeof UserRes>;

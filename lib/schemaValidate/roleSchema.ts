import z from "zod";
import { BranchBody } from "./branchSchema";

// Biểu thức chính quy cho số điện thoại Việt Nam
const phoneNumberRegex = /^(0(1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9])\d{7}|(0[2-9]\d{7}))$/;

export const RoleBody = z
    .array(
        z.object({
            name: z.string(),
            type: z.string(),
        })
    )
    .optional();

export default RoleBody;

import z from "zod";

export const RoleBody = z.object({
    id: z.coerce.number().min(1, "Vui lòng chọn vai trò"),
});

export default RoleBody;

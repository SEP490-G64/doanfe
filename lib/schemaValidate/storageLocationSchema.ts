import z from "zod";
import RoleBody from "./roleSchema";

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

export const StorageLocationBody = z
    .object({
        shelfName: z.string().trim().min(1, "Mã vị trí không được để trống").max(20, "Mã vị trí không quá 20 kí tự"),
        aisle: z.number().min(0, "Số không âm").max(200, "Số không quá 200"),
        rowNumber: z.number().min(0, "Số không âm").max(200, "Số không quá 200"),
        shelfLevel: z.number().min(0, "Số không âm").max(200, "Số không quá 200"),
        zone: z.string().trim().min(1, "Tên khu vực không được để trống").max(200, "Tên khu vực không quá 200 kí tự"),
        locationType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["RACK", "PALLET", "CABINET", "FREEZER"], {
                required_error: "Vui lòng chọn kiểu vị trí lưu trữ",
            })
        ),
        specialCondition: z.string().trim().max(255, "Mô tả điều kiện đặc biệt không quá 255 kí tự").optional(),
        branch: BranchDtoBody,
        active: z.boolean(),
    })
    .strict();

export type StorageLocationBodyType = z.TypeOf<typeof StorageLocationBody>;

// Đối tượng phản hồi
export const StorageLocationRes = z.object({
    data: z.object({
        message: z.string(),
        status: z.string(),
        data: z.object({
            id: z.number(),
            shelfName: z.string().trim().min(1).max(20),
            aisle: z.number().min(0).max(200),
            rowNumber: z.number().min(0).max(200),
            shelfLevel: z.number().min(0).max(200),
            zone: z.string().trim().min(1).max(200),
            locationType: z.enum(["RACK", "PALLET", "CABINET", "FREEZER"]),
            specialCondition: z.string().trim().max(255).optional(),
            branch: BranchDtoBody,
            active: z.boolean(),
        }),
    }),
    message: z.string(),
});

export type StorageLocationResType = z.TypeOf<typeof StorageLocationRes>;

import z from "zod";

const Branch = z.object({ id: z.string().trim(), branchName: z.string().trim() }).strict();

const BranchProduct = z
    .object({
        branch: Branch,
        storageLocation: z.object({ selfName: z.string().trim() }),
        minQuantity: z.coerce.number({ message: "Vui lòng nhập số" }).optional(),
        maxQuantity: z.coerce.number({ message: "Vui lòng nhập số" }).optional(),
        quantity: z.coerce.number({ message: "Vui lòng nhập số" }).optional(),
    })
    .strict();

const SpecialCondition = z
    .object({
        conditionType: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["NHIET_DO", "DO_AM", "ANH_SANG", "KHONG_KHI", "KHAC", ""], {
                required_error: "Vui lòng chọn điều kiện đặc biệt",
            })
        ),
        handlingInstruction: z.string().trim().min(1, "Vui lòng nhập hướng dẫn xử lý"),
    })
    .strict();

const Unit = z.object({ id: z.string().trim(), unitName: z.string().trim() }).strict();

const UnitConversion = z
    .object({
        smallerUnit: Unit,
        factorConversion: z.coerce.number({ message: "Vui lòng nhập số" }),
    })
    .strict();

export const ProductBody = z
    .object({
        productName: z.string().trim().min(1, "Vui lòng nhập tên sản phẩm").max(256, "Giới hạn 255 kí tự"),
        registrationCode: z.string().trim().min(1, "Vui lòng nhập mã đăng ký sản phẩm"),
        urlImage: z.string().trim().optional(),
        activeIngredient: z.string().trim().min(1, "Vui lòng nhập hoạt chất").max(256, "Giới hạn 255 kí tự"),
        excipient: z.string().trim().min(1, "Vui lòng nhập tá dược"),
        formulation: z.string().trim().min(1, "Vui lòng nhập quy cách quy đổi"),
        status: z.preprocess(
            (val) => (val === null || val === undefined || val === "" ? undefined : val), // Turn null to undefined
            z.enum(["CON_HANG", "HET_HANG", "NGUNG_KINH_DOANH", ""], {
                required_error: "Vui lòng chọn trạng thái sản phẩm",
            })
        ),
        category: z.object({ id: z.string().trim().min(1, "Vui lòng chọn nhóm sản phẩm") }),
        type: z.object({ id: z.string().trim().min(1, "Vui lòng chọn loại sản phẩm") }),
        manufacturer: z.object({ id: z.string().trim().min(1, "Vui lòng chọn nhà sản xuất") }),
        unitConversions: z.array(UnitConversion).optional(),
        baseUnit: Unit,
        branchProducts: z.array(BranchProduct).optional(),
        specialConditions: z.array(SpecialCondition).optional(),
    })
    .strict();

export type ProductBodyType = z.TypeOf<typeof ProductBody>;

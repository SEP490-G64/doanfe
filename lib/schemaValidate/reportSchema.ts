import z from "zod";

const PairBody = z.array(
    z.object({
        name: z.string(),
        value1: z.number(),
        value2: z.number(),
    })
);

const Supplier = z.array(
    z.object({
        id: z.string(),
        supplierName: z.string(),
        address: z.string(),
        quantity: z.number(),
        value: z.number(),
    })
);

const Product = z.array(
    z.object({
        id: z.string(),
        productName: z.string(),
        image: z.string(),
        inboundQuantity: z.number(),
        outboundQuantity: z.number(),
        totalQuantity: z.number(),
        inboundPrice: z.number(),
        outboundPrice: z.number(),
        totalPrice: z.number(),
        unitName: z.string(),
    })
);

export const DashboardBody = z
    .object({
        dashboardItems: z.array(z.number()),
        topCategories: PairBody,
        topTypes: PairBody,
        topFiveSuppliers: Supplier,
        topFiveProducts: Product,
    })
    .strict();

export type DashboardBodyType = z.TypeOf<typeof DashboardBody>;

const DashboardChartBody = z.array(
    z.object({
        time: z.string(),
        inbound: z.number(),
        outbound: z.number(),
    })
);

export type DashboardChartBodyType = z.TypeOf<typeof DashboardChartBody>;

export interface ProductInfor {
    image?: string;
    id?: number;
    registrationCode?: string;
    productName?: string;
    discount?: number;
    baseUnit?: {
        id?: number;
        unitName?: string;
    };
    requestQuantity?: number;
}

export interface Outbound {
    index: number;
    id: number;
    outBoundCode: string;
    outboundType: "HUY_HANG" | "TRA_HANG" | "BAN_HANG" | "CHUYEN_KHO_NOI_BO";
    toBranch: {
        id: 1;
        branchName: string;
    };
    fromBranch: {
        id: number;
        branchName: string;
    };
    supplier: {
        id: number;
        supplierName: string;
    };
    createdBy: {
        id: number;
        userName: string;
        email: string;
        phone: string;
        firstName: string;
        lastName: string;
        status: string;
    };
    createdDate: string | Date;
    status: string;
    totalPrice: number;
    outboundDetails: [];
    outboundBatchDetails: [];
}
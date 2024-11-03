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

export interface Inbound {
    index: number;
    id: number;
    inboundCode: string;
    inboundType: "NHAP_TU_NHA_CUNG_CAP" | "CHUYEN_KHO_NOI_BO";
    toBranch: {
        id: 1;
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
    inboundDetails: [];
    inboundBatchDetails: [];
}

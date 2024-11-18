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
    batch?: {
        id?: string;
        batchCode?: string;
        expireDate?: string;
    };
    batches?: {
        id?: string;
        batchCode?: string;
        expireDate?: string;
    }[];
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
    inboundDetails: [];
    inboundBatchDetails: [];
}

export type DataSearch = {
    keyword?: string;
    branchId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: string;
};

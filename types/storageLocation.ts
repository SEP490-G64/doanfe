import { Branch } from "@/types/branch";

export type StorageLocation = {
    index: number;
    id: string;
    shelfName: string;
    aisle: string;
    rowNumber: number;
    shelfLevel: number;
    zone: string;
    locationType: string;
    specialCondition: string;
    branch: Branch;
    active: boolean;
};

export type DataSearch = {
    keyword?: string;
    branchId?: string;
};

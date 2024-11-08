export type Branch = {
    index: number;
    id: string;
    branchName: string;
    branchType: "MAIN" | "SUB";
    location: string;
    contactPerson: string;
    phoneNumber: string;
    capacity: number;
    activeStatus: boolean;
    actions: string;
};

export type DataSearch = {
    keyword?: string;
    branchType?: string;
    activeStatus?: boolean;
};

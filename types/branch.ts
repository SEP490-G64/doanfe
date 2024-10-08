export type Branch = {
    index: number;
    id: string;
    branchName: string;
    branchType: "Trụ sở chính" | "Chi nhánh";
    location: string;
    contactPerson: string;
    phoneNumber: string;
    capacity: number;
    activeStatus: boolean;
    actions: string;
};

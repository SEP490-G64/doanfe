export type Manufacturer = {
    index: number;
    id: string;
    manufacturerName: string;
    address: string;
    email: string;
    phoneNumber: string;
    taxCode: string;
    origin: string;
    status: boolean;
};

export type DataSearch = {
    keyword?: string;
    status?: string;
};

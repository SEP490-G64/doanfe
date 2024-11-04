export type Product = {
    index: number;
    id: string;
    productName: string;
    registrationCode: string;
    urlImage: string;
    activeIngredient: string;
    excipient: string;
    formulation: string;
    inboundPrice: number;
    sellPrice: number;
    status: string;
    baseUnit: string;
    categoryName: string;
    typeName: string;
    manufacturerName: string;
};

export type DataSearch = {
    keyword?: string;
    typeId?: string;
    categoryId?: string;
    manufacturerId?: string;
    status?: string;
};

export type AllowProduct = {
    index: number;
    id: string;
    productName: string;
    productCode: string;
    registrationCode: string;
    urlImage: string;
    activeIngredient: string;
    excipient: string;
    formulation: string;
};

export type ProductDataSearch = {
    keyword?: string;
};

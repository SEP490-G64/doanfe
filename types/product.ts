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
    quantity: number;
    unitConversions?: Array<UnitConversion>;
    expireDate?: string;
};

export type UnitConversion = {
    index: number;
    id: string;
    largerUnit?: {
        id?: string;
        unitName?: string;
    };
    smallerUnit: {
        id?: string;
        unitName?: string;
    };
    factorConversion: number;
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

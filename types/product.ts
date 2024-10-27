export type Product = {
    index: number;
    id: string;
    productBaseDTO: {
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
    minQuantity: number;
    maxQuantity: number;
    quantity: number;
};

export type DataSearch = {
    keyword?: string;
    typeId?: string;
    categoryId?: string;
    manufacturerId?: string;
    status?: string;
};

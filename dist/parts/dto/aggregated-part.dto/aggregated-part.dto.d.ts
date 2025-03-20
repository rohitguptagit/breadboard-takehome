export type SupplierName = "Arrow" | "TTI";
export declare class AggregatedPart {
    name: string;
    description: string;
    totalStock: number;
    manufacturerLeadTime: number;
    manufacturerName: string;
    packaging: Packaging[];
    productDoc: string;
    productUrl: string;
    productImageUrl: string;
    specifications: Record<string, any>;
    sourceParts: SupplierName[];
}
export declare class Packaging {
    type: string;
    minimumOrderQuantity: number;
    quantityAvailable: number;
    unitPrice: number;
    supplier: SupplierName;
    priceBreaks: PriceBreak[];
    manufacturerLeadTime?: string;
}
export declare class PriceBreak {
    breakQuantity: number;
    unitPrice: number;
    totalPrice: number;
}

import { AggregatedPart } from './dto/aggregated-part.dto/aggregated-part.dto';
export declare class PartsService {
    private readonly MY_ARROW_URL;
    private readonly TTI_URL;
    getAggregatedPart(partNumber: string): Promise<AggregatedPart>;
    private getTotalStock;
    private getShortestLeadTime;
    private getProductUrl;
    private aggregatePackaging;
}

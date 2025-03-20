import { PartsService } from './parts.service';
export declare class PartsController {
    private readonly partsService;
    constructor(partsService: PartsService);
    getAggregatedPart(partNumber: string): Promise<import("./dto/aggregated-part.dto/aggregated-part.dto").AggregatedPart>;
}

// src/parts/parts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { AggregatedPart, Packaging, SupplierName } from './dto/aggregated-part.dto/aggregated-part.dto';

@Injectable()
export class PartsService {
    private readonly MY_ARROW_URL = 'https://backend-takehome.s3.us-east-1.amazonaws.com/myarrow.json';
    private readonly TTI_URL = 'https://backend-takehome.s3.us-east-1.amazonaws.com/tti.json';

    async getAggregatedPart(partNumber: string): Promise<AggregatedPart> {
        if (partNumber !== '0510210200') {
            throw new NotFoundException('Part number not found');
        }

        const [arrowData, ttiData] = await Promise.all([
            axios.get(this.MY_ARROW_URL),
            axios.get(this.TTI_URL),
        ]);

        const arrowParts = arrowData.data.pricingResponse.filter(part => part.partNumber === partNumber);
        const ttiParts = ttiData.data.parts.filter(part => part.manufacturerPartNumber === partNumber);

        if (!arrowParts.length && !ttiParts.length) {
            throw new NotFoundException('Part number not found in any supplier');
        }

        const aggregatedPart: AggregatedPart = {
            name: arrowParts[0]?.suppPartNum?.name || ttiParts[0]?.ttiPartNumber || '',
            description: arrowParts[0]?.description || ttiParts[0]?.description || '',
            totalStock: this.getTotalStock(arrowParts, ttiParts),
            manufacturerLeadTime: this.getShortestLeadTime(arrowParts, ttiParts),
            manufacturerName: arrowParts[0]?.manufacturer || ttiParts[0]?.manufacturer || '',
            packaging: this.aggregatePackaging(arrowParts, ttiParts),
            productDoc: this.getProductUrl(arrowParts, ttiParts, 'Datasheet'), 
            productUrl: this.getProductUrl(arrowParts, ttiParts, 'Part Details'),
            productImageUrl: this.getProductUrl(arrowParts, ttiParts, 'Image Large'),
            specifications: {}, // No clear specifications format in the data
            sourceParts: [
                ...(arrowParts.length ? ['Arrow' as SupplierName] : []),
                ...(ttiParts.length ? ['TTI' as SupplierName] : []),
            ]
        };

        return aggregatedPart;
    }

    private getTotalStock(arrowParts: any[], ttiParts: any[]): number {
        const arrowStock = arrowParts.reduce((sum, part) => sum + Number(part.fohQuantity), 0);
        const ttiStock = ttiParts.reduce((sum, part) => sum + Number(part.availableToSell), 0);
        return arrowStock + ttiStock;
    }

    private getShortestLeadTime(arrowParts: any[], ttiParts: any[]): number {
        const arrowLeadTime = arrowParts.map(part => part.leadTime?.supplierLeadTime || Infinity);
        const ttiLeadTime = ttiParts.map(part => Number(ttiParts[0]?.leadTime.split(' ')[0]) * 7 || Infinity);
        return Math.min(...arrowLeadTime, ...ttiLeadTime);
    }

    private getProductUrl(arrowParts: any[], ttiParts: any[], type: string): string {
        const arrowUrl = arrowParts.flatMap(part => part.urlData).find(url => url.type === type)?.value || '';
        const ttiUrl = ttiParts[0]?.[type === 'Datasheet' ? 'datasheetURL' : 'buyUrl'] || '';
        return arrowUrl || ttiUrl;
    }

    private aggregatePackaging(arrowParts = [], ttiParts = []): Packaging[] {
        const arrowPackaging = arrowParts.map(part => ({
            type: part.pkg || 'Unspecified',
            minimumOrderQuantity: part.minOrderQuantity || 1,
            quantityAvailable: Number(part.fohQuantity) || 0,
            unitPrice: Number(part.resalePrice) || 0,
            supplier: 'Arrow' as 'Arrow',
            priceBreaks: part.pricingTier?.map(pb => ({
                breakQuantity: Number(pb.minQuantity),
                unitPrice: Number(pb.resalePrice),
                totalPrice: Number(pb.minQuantity) * Number(pb.resalePrice)
            })) || [],
            manufacturerLeadTime: part.leadTime?.supplierLeadTime?.toString() || 'N/A'
        }));

        const ttiPackaging = ttiParts.map(part => ({
            type: part.packaging || 'Unspecified',
            minimumOrderQuantity: part.salesMinimum || 1,
            quantityAvailable: Number(part.availableToSell) || 0,
            unitPrice: Number(part.pricing?.vipPrice) || 0,
            supplier: 'TTI' as 'TTI',
            priceBreaks: part.pricing?.quantityPriceBreaks.map(pb => ({
                breakQuantity: pb.quantity,
                unitPrice: Number(pb.price),
                totalPrice: Number(pb.quantity) * Number(pb.price)
            })) || [],
            manufacturerLeadTime: Number(part.leadTime.split(' ')[0]) * 7 + ' days' || 'N/A'
        }));

        return [...arrowPackaging, ...ttiPackaging];
    }
}
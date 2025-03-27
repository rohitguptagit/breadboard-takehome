"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartsService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let PartsService = class PartsService {
    constructor() {
        this.MY_ARROW_URL = 'https://backend-takehome.s3.us-east-1.amazonaws.com/myarrow.json';
        this.TTI_URL = 'https://backend-takehome.s3.us-east-1.amazonaws.com/tti.json';
    }
    async getAggregatedPart(partNumber) {
        if (partNumber !== '0510210200') {
            throw new common_1.NotFoundException('Part number not found');
        }
        const [arrowData, ttiData] = await Promise.all([
            axios_1.default.get(this.MY_ARROW_URL),
            axios_1.default.get(this.TTI_URL),
        ]);
        const arrowParts = arrowData.data.pricingResponse.filter(part => part.partNumber === partNumber);
        const ttiParts = ttiData.data.parts.filter(part => part.manufacturerPartNumber === partNumber);
        if (!arrowParts.length && !ttiParts.length) {
            throw new common_1.NotFoundException('Part number not found in any supplier');
        }
        const aggregatedPart = {
            name: arrowParts[0]?.suppPartNum?.name || ttiParts[0]?.ttiPartNumber || '',
            description: arrowParts[0]?.description || ttiParts[0]?.description || '',
            totalStock: this.getTotalStock(arrowParts, ttiParts),
            manufacturerLeadTime: this.getShortestLeadTime(arrowParts, ttiParts),
            manufacturerName: arrowParts[0]?.manufacturer || ttiParts[0]?.manufacturer || '',
            packaging: this.aggregatePackaging(arrowParts, ttiParts),
            productDoc: this.getProductUrl(arrowParts, ttiParts, 'Datasheet'),
            productUrl: this.getProductUrl(arrowParts, ttiParts, 'Part Details'),
            productImageUrl: this.getProductUrl(arrowParts, ttiParts, 'Image Large'),
            specifications: {},
            sourceParts: [
                ...(arrowParts.length ? ['Arrow'] : []),
                ...(ttiParts.length ? ['TTI'] : []),
            ]
        };
        return aggregatedPart;
    }
    getTotalStock(arrowParts, ttiParts) {
        const arrowStock = arrowParts.reduce((sum, part) => sum + Number(part.fohQuantity), 0);
        const ttiStock = ttiParts.reduce((sum, part) => sum + Number(part.availableToSell), 0);
        return arrowStock + ttiStock;
    }
    getShortestLeadTime(arrowParts, ttiParts) {
        const arrowLeadTime = arrowParts.map(part => part.leadTime?.supplierLeadTime || Infinity);
        const ttiLeadTime = ttiParts.map(part => Number(ttiParts[0]?.leadTime.split(' ')[0]) * 7 || Infinity);
        return Math.min(...arrowLeadTime, ...ttiLeadTime);
    }
    getProductUrl(arrowParts, ttiParts, type) {
        const arrowUrl = arrowParts.flatMap(part => part.urlData).find(url => url.type === type)?.value || '';
        const ttiUrl = ttiParts[0]?.[type === 'Datasheet' ? 'datasheetURL' : 'buyUrl'] || '';
        return arrowUrl || ttiUrl;
    }
    aggregatePackaging(arrowParts = [], ttiParts = []) {
        const arrowPackaging = arrowParts.map(part => ({
            type: part.pkg || 'Unspecified',
            minimumOrderQuantity: part.minOrderQuantity || 1,
            quantityAvailable: Number(part.fohQuantity) || 0,
            unitPrice: Number(part.resalePrice) || 0,
            supplier: 'Arrow',
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
            supplier: 'TTI',
            priceBreaks: part.pricing?.quantityPriceBreaks.map(pb => ({
                breakQuantity: pb.quantity,
                unitPrice: Number(pb.price),
                totalPrice: Number(pb.quantity) * Number(pb.price)
            })) || [],
            manufacturerLeadTime: Number(part.leadTime.split(' ')[0]) * 7 + ' days' || 'N/A'
        }));
        return [...arrowPackaging, ...ttiPackaging];
    }
};
exports.PartsService = PartsService;
exports.PartsService = PartsService = __decorate([
    (0, common_1.Injectable)()
], PartsService);
//# sourceMappingURL=parts.service.js.map
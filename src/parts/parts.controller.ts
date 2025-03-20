// src/parts/parts.controller.ts
import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { PartsService } from './parts.service';

@Controller('parts')
export class PartsController {
    constructor(private readonly partsService: PartsService) {}

    @Get('aggregate')
    async getAggregatedPart(@Query('partNumber') partNumber: string) {
        if (!partNumber) {
            throw new NotFoundException('Part number is required');
        }

        return await this.partsService.getAggregatedPart(partNumber);
    }
}
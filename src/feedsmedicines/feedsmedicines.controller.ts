import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FeedsmedicinesService } from './feedsmedicines.service';
import { CreateFeedsmedicineDto } from './dto/create-feedsmedicine.dto';
import { UpdateFeedsmedicineDto } from './dto/update-feedsmedicine.dto';
import { ConsumptionDto } from './dto/consumption.dto';

@ApiBearerAuth()
@ApiTags('Obat')
@Controller('obat')
export class FeedsmedicinesController {
  constructor(private readonly feedsmedicinesService: FeedsmedicinesService) {}

  @ApiQuery({
    name: 'coopId',
    type: Number,
    description: 'Id kandang yang dicari.',
    required: false,
  })
  @Get('/dropdown')
  async dropdown(@Query('coopId') coopId?: number) {
    return await this.feedsmedicinesService.getDropdownPakan(coopId);
  }

  @Post()
  async create(@Body() createFeedsmedicineDto: CreateFeedsmedicineDto) {
    return await this.feedsmedicinesService.create(createFeedsmedicineDto);
  }

  @ApiQuery({
    name: 'coopId',
    type: Number,
    description: 'Id kandang yang dicari.',
    required: false,
  })
  @Get()
  async findAll(@Query('coopId') coopId?: number) {
    return await this.feedsmedicinesService.findAll(coopId);
  }

  @ApiQuery({
    name: 'start_date',
    type: Date,
    description: 'Tanggal awal.',
    required: false,
  })
  @ApiQuery({
    name: 'end_date',
    type: Date,
    description: 'Tanggal akhir.',
    required: false,
  })
  @ApiQuery({
    name: 'coop_id',
    type: Number,
    description: 'id kandang.',
    required: false,
  })
  @Get('usage-history')
  async getReportHistory(
    @Query('start_date') start_date?: Date,
    @Query('end_date') end_date?: Date,
    @Query('coop_id') coop_id?: number,
  ) {
    return await this.feedsmedicinesService.getReport(
      start_date,
      end_date,
      coop_id,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.feedsmedicinesService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFeedsmedicineDto: UpdateFeedsmedicineDto,
  ) {
    return this.feedsmedicinesService.update(+id, updateFeedsmedicineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedsmedicinesService.remove(+id);
  }

  @Post('/consumption')
  async consumption(@Body() consumptionDto: ConsumptionDto) {
    return await this.feedsmedicinesService.consumption(consumptionDto);
  }
}

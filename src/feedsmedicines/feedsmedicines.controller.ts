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
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FeedsmedicinesService } from './feedsmedicines.service';
import { CreateFeedsmedicineDto } from './dto/create-feedsmedicine.dto';
import { UpdateFeedsmedicineDto } from './dto/update-feedsmedicine.dto';

@ApiBearerAuth()
@ApiTags('Obat')
@Controller('obat')
export class FeedsmedicinesController {
  constructor(private readonly feedsmedicinesService: FeedsmedicinesService) {}

  @Post()
  create(@Body() createFeedsmedicineDto: CreateFeedsmedicineDto) {
    return this.feedsmedicinesService.create(createFeedsmedicineDto);
  }

  @Get()
  async findAll() {
    return await this.feedsmedicinesService.findAll();
  }

  @Get('usage-history')
  async getReportHistory(
    @Query('start_date') start_date: Date,
    @Query('end_date') end_date: Date,
    @Query('coop_id') coop_id: number,
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
}

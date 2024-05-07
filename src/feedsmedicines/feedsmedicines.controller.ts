import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FeedsmedicinesService } from './feedsmedicines.service';
import { CreateFeedsmedicineDto } from './dto/create-feedsmedicine.dto';
import { UpdateFeedsmedicineDto } from './dto/update-feedsmedicine.dto';

@ApiBearerAuth()
@ApiTags('obat')
@Controller('obat')
export class FeedsmedicinesController {
  constructor(private readonly feedsmedicinesService: FeedsmedicinesService) {}

  @Post()
  create(@Body() createFeedsmedicineDto: CreateFeedsmedicineDto) {
    return this.feedsmedicinesService.create(createFeedsmedicineDto);
  }

  @Get()
  findAll() {
    return this.feedsmedicinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedsmedicinesService.findOne(+id);
  }

  @Patch(':id')
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

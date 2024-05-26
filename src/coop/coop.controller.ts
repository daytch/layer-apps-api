import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CoopService } from './coop.service';
import { CreateCoopDto } from './dto/create-coop.dto';
import { UpdateCoopDto } from './dto/update-coop.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Kandang')
@Controller('coop')
export class CoopController {
  constructor(private readonly coopService: CoopService) {}

  @Post()
  async create(@Body() createCoopDto: CreateCoopDto) {
    return await this.coopService.create(createCoopDto);
  }

  @Get()
  async findAll() {
    return await this.coopService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.coopService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCoopDto: UpdateCoopDto) {
    return await this.coopService.update(+id, updateCoopDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.coopService.remove(+id);
  }
}

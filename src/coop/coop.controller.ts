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
  create(@Body() createCoopDto: CreateCoopDto) {
    return this.coopService.create(createCoopDto);
  }

  @Get()
  findAll() {
    return this.coopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coopService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCoopDto: UpdateCoopDto) {
    return this.coopService.update(+id, updateCoopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coopService.remove(+id);
  }
}

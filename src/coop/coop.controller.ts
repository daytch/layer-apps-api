import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoopService } from './coop.service';
import { CreateCoopDto } from './dto/create-coop.dto';
import { UpdateCoopDto } from './dto/update-coop.dto';
import { Public } from '../auth/constants';
import { ApiTags } from '@nestjs/swagger';

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

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coopService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoopDto: UpdateCoopDto) {
    return this.coopService.update(+id, updateCoopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coopService.remove(+id);
  }
}

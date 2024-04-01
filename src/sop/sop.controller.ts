import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SopService } from './sop.service';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { CompleteDto } from './dto/complete-sop.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/constants';

@ApiBearerAuth()
@ApiTags('SOP')
@Controller('sop')
export class SopController {
  constructor(private readonly sopService: SopService) {}

  @Post()
  create(@Body() createSopDto: CreateSopDto) {
    return this.sopService.create(createSopDto);
  }

  @Get()
  findAll() {
    return this.sopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sopService.findOne(+id);
  }

  @Get(':roleId')
  findByRoleId(@Param('roleId') roleId: string) {
    return this.sopService.findByRoleId(+roleId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSopDto: UpdateSopDto) {
    return this.sopService.update(+id, updateSopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sopService.remove(+id);
  }

  @Public()
  @Post('/complete')
  complete(@Body() completeDto: CompleteDto) {
    try {
      return this.sopService.complete(completeDto);
    } catch (error) {
      throw error;
    }
  }
}

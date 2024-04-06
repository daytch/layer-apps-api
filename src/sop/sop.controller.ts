import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SopService } from './sop.service';
import { CreateSopDto } from './dto/create-sop.dto';
import { UpdateSopDto } from './dto/update-sop.dto';
import { CompleteDto } from './dto/complete-sop.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Public } from '../auth/constants';

@ApiBearerAuth()
@ApiTags('SOP')
@Controller('sop')
export class SopController {
  constructor(private readonly sopService: SopService) {}

  @Post()
  create(@Body() createSopDto: CreateSopDto) {
    return this.sopService.create(createSopDto);
  }

  @Get('/getallsop')
  @ApiQuery({ name: 'roleId', required: false, type: String })
  findAll(@Query('roleId') roleId: string = '') {
    return this.sopService.findAll(roleId);
  }

  @Get('/getsop/:id')
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

  @Get('/progress/:roleId/:date')
  getProgress(@Param('roleId') roleId: string, @Param('date') date: string) {
    return this.sopService.getProgressAllEmployee(roleId, date);
  }
}

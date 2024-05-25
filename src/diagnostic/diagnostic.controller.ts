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
import { DiagnosticService } from './diagnostic.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { UpdateDiagnosticDto } from './dto/update-diagnostic.dto';

@ApiBearerAuth()
@ApiTags('diagnosa')
@Controller('diagnostic')
export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  @Post()
  create(@Body() createDiagnosticDto: CreateDiagnosticDto) {
    return this.diagnosticService.create(createDiagnosticDto);
  }

  @Get()
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'userId', required: false })
  findAll(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('userId') userId: number,
  ) {
    return this.diagnosticService.findAll(from, to, userId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosticDto: UpdateDiagnosticDto,
  ) {
    return this.diagnosticService.update(+id, updateDiagnosticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diagnosticService.remove(+id);
  }
}

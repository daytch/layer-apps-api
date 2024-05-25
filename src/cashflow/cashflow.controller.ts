import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { CashflowService } from './cashflow.service';
import { CreateCashflowDto } from './dto/create-cashflow.dto';
import { UpdateCashflowDto } from './dto/update-cashflow.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Cashflow')
@Controller('cashflow')
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Post()
  create(@Body() createCashflowDto: CreateCashflowDto) {
    return this.cashflowService.create(createCashflowDto);
  }

  @Get()
  findAll() {
    return this.cashflowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashflowService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCashflowDto: UpdateCashflowDto,
  ) {
    return this.cashflowService.update(+id, updateCashflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cashflowService.remove(+id);
  }
}

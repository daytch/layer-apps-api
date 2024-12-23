import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { CashflowService } from './cashflow.service';
import { CreateCashflowDto } from './dto/create-cashflow.dto';
import { UpdateCashflowDto } from './dto/update-cashflow.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { multerOptions } from 'src/egg/upload';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from 'src/egg/dto/fileUpload.dto';

@ApiBearerAuth()
@ApiTags('Cashflow')
@Controller('cashflow')
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @Post()
  create(@Body() createCashflowDto: CreateCashflowDto, @Request() req) {
    return this.cashflowService.create(createCashflowDto, req.user);
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload report',
    type: FileUploadDto,
  })
  async uploadedFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileUploadDto,
  ) {
    return this.cashflowService.proccess(file, body);
  }

  @Get('/report/:id')
  @ApiQuery({ name: 'period', required: true })
  async getReport(@Param('id') id: string, @Query('period') period: string) {
    return await this.cashflowService.getReport(+id, period);
  }
}

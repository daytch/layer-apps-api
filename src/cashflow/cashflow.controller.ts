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
  StreamableFile,
  Header,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
import { multerOptions } from '../egg/upload';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReportUploadDto } from '../cashflow/dto/reportUpload.dto';

@ApiBearerAuth()
@ApiTags('Cashflow')
@Controller('cashflow')
export class CashflowController {
  constructor(private readonly cashflowService: CashflowService) {}

  @ApiQuery({
    name: 'coopId',
    type: Number,
    description: 'Id kandang yang dicari.',
    required: false,
  })
  @ApiQuery({
    name: 'period',
    type: Date,
    description: 'Periode laporan yang dicari.',
    required: false,
  })
  @Get('/report-income')
  async getReportNetIncome(
    @Query('coopId') coopId?: number,
    @Query('period') period?: Date,
  ) {
    return await this.cashflowService.getReportNetIncome(coopId, period);
  }

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
    type: ReportUploadDto,
  })
  async uploadedFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ReportUploadDto,
  ) {
    return this.cashflowService.proccess(file, body);
  }

  @Get('/report/:id')
  @ApiQuery({ name: 'period', required: true })
  async getReport(@Param('id') id: string, @Query('period') period: string) {
    return await this.cashflowService.getReport(+id, period);
  }

  @Get('download/:coopId/:period')
  @Header('content-type', 'application/vnd.ms-excel')
  async downloadXlsxFile(
    @Param('period') period: string,
    @Param('coopId') coopId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const { buffer, title } = await this.cashflowService.download(
      coopId,
      period,
    );
    res.set({
      'Content-Disposition': `attachment; filename="${title}"`,
    });
    return new StreamableFile(buffer);
  }
}

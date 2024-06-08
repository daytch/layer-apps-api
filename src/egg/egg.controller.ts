import {
  Post,
  Controller,
  UseInterceptors,
  UploadedFile,
  Get,
  StreamableFile,
  Param,
  Header,
  Body,
  Query,
  Request,
} from '@nestjs/common';
import { EggService } from './egg.service';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/fileUpload.dto';
import { multerOptions } from 'src/egg/upload';
import { ResponseUpload } from './dto/ResponseUpload.dto';
import { ParamGetAllData } from './dto/ParamsGetAllData.dto';
import { DeleteEggs } from './dto/DeleteEggs.dto';

@ApiBearerAuth()
@ApiTags('Egg')
@Controller('egg')
export class EggController {
  constructor(private readonly eggService: EggService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Eggs Production per day',
    type: FileUploadDto,
  })
  async uploadedFile(@UploadedFile() file: Express.Multer.File) {
    return this.eggService.proccess(file);
  }

  @Get('download/:coopId/:date')
  @Header('content-type', 'application/vnd.ms-excel')
  @Header('content-disposition', 'attachment; filename="report.xlsx"')
  async downloadXlsxFile(
    @Param('coopId') coopId: number,
    @Param('date') date: string,
  ): Promise<StreamableFile> {
    const file = await this.eggService.download(Number(coopId), date);
    return new StreamableFile(file);
  }

  @Post('duplicate-confirm')
  async duplicateConfirmation(@Body() respUpload: ResponseUpload) {
    return this.eggService.confirm(respUpload);
  }

  @Get()
  async findAll(@Query() params: ParamGetAllData, @Request() req) {
    return await this.eggService.findAll(params, req);
  }

  @Post('delete')
  async delete(@Body() data: DeleteEggs) {
    return await this.eggService.delete(data);
  }
}

import {
  Post,
  Controller,
  UseInterceptors,
  UploadedFile,
  Get,
  StreamableFile,
  Param,
  Header,
} from '@nestjs/common';
import { EggService } from './egg.service';
import { ApiTags, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/fileUpload.dto';
import { multerOptions } from 'src/egg/upload';
import { Public } from 'src/auth/constants';
import { ResponseUpload } from './dto/ResponseUpload.dto';

@ApiBearerAuth()
@ApiTags('Egg')
@Controller('egg')
export class EggController {
  constructor(private readonly eggService: EggService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Eggs Production per day',
    type: FileUploadDto,
  })
  async uploadedFile(@UploadedFile() file: Express.Multer.File) {
    return this.eggService.proccess(file);
  }

  @Public()
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

  // @Post('duplicate-confirm')
  // async duplicateConfirmation(@Body() respUpload: ResponseUpload) {
  //   return this.eggService.confirm(respUpload);
  // }
}

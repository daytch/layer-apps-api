import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ required: true })
  @IsNumber()
  coopId: number;
}

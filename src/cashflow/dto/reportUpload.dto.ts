import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class ReportUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ required: true })
  @IsNumber()
  coopId: number;

  @ApiProperty({ required: true })
  @IsDate()
  period: Date;
}

import { IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConsumptionDto {
  @ApiProperty()
  @IsNumber()
  coopId?: number;

  @ApiProperty()
  @IsNumber()
  feedId?: number;

  @ApiProperty()
  @IsNumber()
  total?: number;

  @ApiProperty()
  @IsDate()
  transDate?: Date;
}

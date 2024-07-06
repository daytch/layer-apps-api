import { IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsedHistoryDTO {
  @ApiProperty()
  @IsDate()
  start_date: Date;

  @ApiProperty()
  @IsDate()
  end_date: Date;

  @ApiProperty()
  @IsNumber()
  coopId: number;
}

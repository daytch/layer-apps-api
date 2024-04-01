import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompleteDto {
  @ApiProperty()
  @IsNumber()
  sopId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}

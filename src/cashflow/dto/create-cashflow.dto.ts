import { IsString, IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCashflowDto {
  @ApiProperty()
  @IsDate()
  periode: Date;

  @ApiProperty()
  @IsString()
  tipe: string;

  @ApiProperty()
  @IsNumber()
  nominal: number;
}

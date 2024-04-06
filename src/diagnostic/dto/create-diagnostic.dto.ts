import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiagnosticDto {
  @ApiProperty()
  @IsNumber()
  coopId: number;

  @ApiProperty()
  @IsDate()
  transDate: Date;

  @ApiProperty()
  @IsString()
  disease: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  medicineId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  dose: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsNumber()
  reporterId: number;
}

import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedsmedicineDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  SKU: string;

  @ApiProperty()
  @IsNumber()
  coopId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  uom: string;
}

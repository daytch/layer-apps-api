import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSopDto {
  @ApiProperty()
  @IsNumber()
  roleId: number;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  time: string;

  @ApiProperty()
  @IsBoolean()
  isReduceStock: boolean;
}

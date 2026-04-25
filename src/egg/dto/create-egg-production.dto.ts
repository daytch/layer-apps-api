import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEggProductionDto {
  @IsInt()
  coopId: number;

  @IsDateString()
  transDate: string;

  @IsOptional()
  @IsInt()
  ageInDay?: number;

  @IsOptional()
  @IsInt()
  ageInWeek?: number;

  @IsOptional()
  @IsInt()
  pop?: number;

  @IsOptional()
  @IsInt()
  m?: number;

  @IsOptional()
  @IsInt()
  afk?: number;

  @IsOptional()
  @IsInt()
  sell?: number;

  @IsOptional()
  @IsInt()
  finalPop?: number;

  @IsOptional()
  @IsString()
  feedType?: string;

  @IsOptional()
  @IsInt()
  feedWeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  feedFIT?: number;

  @IsOptional()
  @IsInt()
  prodPieceN?: number;

  @IsOptional()
  @IsInt()
  prodPieceP?: number;

  @IsOptional()
  @IsInt()
  prodPieceBS?: number;

  @IsOptional()
  @IsInt()
  prodTotalPiece?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prodWeightN?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prodWeightP?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prodWeightBS?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  prodTotalWeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  HD?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  FCR?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  EggWeight?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  EggMass?: number;

  @IsOptional()
  @IsString()
  OVK?: string;
}
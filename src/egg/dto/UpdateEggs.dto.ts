import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateEggs {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNumber()
  ageInDay: number;

  @ApiProperty()
  ageInWeek: number;

  @ApiProperty()
  pop: number;

  @ApiProperty()
  m: number;

  @ApiProperty()
  afk: number;

  @ApiProperty()
  sell: number;

  @ApiProperty()
  finalPop: number;

  @ApiProperty()
  feedType: string;

  @ApiProperty()
  feedWeight: number;

  @ApiProperty()
  feedFIT: number;

  @ApiProperty()
  prodPieceN: number;

  @ApiProperty()
  prodPieceP: number;

  @ApiProperty()
  prodPieceBS: number;

  @ApiProperty()
  prodTotalPiece: number;

  @ApiProperty()
  prodWeightN: number;

  @ApiProperty()
  prodWeightP: number;

  @ApiProperty()
  prodWeightBS: number;

  @ApiProperty()
  prodTotalWeight: number;

  @ApiProperty()
  HD: number;

  @ApiProperty()
  FCR: number;

  @ApiProperty()
  EggWeight: number;

  @ApiProperty()
  EggMass: number;

  @ApiProperty()
  OVK: number;
}

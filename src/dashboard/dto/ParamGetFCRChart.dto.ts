import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Param {
  @ApiProperty()
  coopId: number;
  @ApiPropertyOptional()
  period: number;
}

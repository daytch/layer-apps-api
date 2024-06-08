import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ParamGetAllData {
  @ApiProperty()
  coopId: number;
  @ApiPropertyOptional()
  period: number;
}

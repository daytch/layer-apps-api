import { ApiProperty } from '@nestjs/swagger';

export class DeleteEggs {
  @ApiProperty()
  ids: number[];
}

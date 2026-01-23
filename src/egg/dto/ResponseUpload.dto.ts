import { IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EResponseUpload } from '../egg.service';

export class ResponseUpload {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsEnum(EResponseUpload)
  status: number;
}

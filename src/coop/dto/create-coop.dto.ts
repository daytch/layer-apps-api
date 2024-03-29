import { IsString } from 'class-validator';

export class CreateCoopDto {
  @IsString()
  name: string;

  @IsString()
  nik: string;

  @IsString()
  address: string;
}

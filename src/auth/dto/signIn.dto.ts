import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ default: 'SA-123' })
  username: string;

  @ApiProperty({ default: 'superadmin123' })
  password: string;
}

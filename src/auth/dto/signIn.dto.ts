import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ default: 'CK-001' })
  username: string;

  @ApiProperty({ default: 'superadmin123' })
  password: string;
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username, pass);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.nik };
    return { ...user, access_token: await this.jwtService.signAsync(payload) };
  }
}

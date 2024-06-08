/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from 'src/role/role.service';

export interface IPayload {
  uid: number;
  username: string;
  roleId: number;
  coopId: number;
}
export interface IUserProfile {
  id: number;
  nik: string;
  name: string;
  roleId: number;
  email: string;
  phone: string;
  avatar: null;
  is_active: boolean;
  coops: ICoop[];
  role_name: string;
}

export interface ICoop {
  coopId: number;
  coop_name: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username, pass);
    if (!user) {
      throw new UnauthorizedException();
    }

    const role = await this.roleService.findOne(user.roleId);
    const payload = {
      uid: user.id,
      username: user.nik,
      roleId: user.roleId,
      // coopId: user.coopId,
    };
    return {
      ...user,
      access_token: await this.jwtService.signAsync(payload),
      role_name: role.name,
    };
  }

  async getProfile(payload: IPayload): Promise<IUserProfile> {
    const user = await this.usersService.findOneById(payload.uid);
    if (!user) {
      throw new UnauthorizedException();
    }

    const role = await this.roleService.findOne(user.roleId);
    return <IUserProfile>{
      ...user,
      role_name: role.name,
    };
  }
}

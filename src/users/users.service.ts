import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
// import { randomstring } from '../utils/randomizer.utils';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

const saltOrRounds = 12;

export interface IUser {
  id: number;
  nik: string;
  name: string;
  roleId: number;
  coopId: number;
  email: string;
  phone: string;
  avatar: string;
  is_active: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findProfile(id: number): Promise<IUser | undefined> {
    return await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        nik: true,
        name: true,
        roleId: true,
        coopId: true,
        email: true,
        phone: true,
        avatar: true,
        is_active: true,
      },
    });
  }

  async getAllActiveUsers(): Promise<IUser[] | undefined> {
    return await this.prisma.users.findMany({
      where: { is_active: true },
      select: {
        id: true,
        nik: true,
        name: true,
        roleId: true,
        coopId: true,
        email: true,
        phone: true,
        avatar: true,
        is_active: true,
      },
    });
  }

  async findOne(username: string, pass: string): Promise<IUser | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { nik: username },
    });

    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(pass, user?.password);
    if (!isMatch) {
      return null;
    }
    return <IUser>{
      id: user.id,
      nik: user.nik,
      name: user.name,
      roleId: user.roleId,
      coopId: user.coopId,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      is_active: user.is_active,
    };
  }
  generateNIK = (total: number) => {
    let nik = `${total + 1}`;
    while (nik.length < 3) {
      nik = '0' + nik;
    }
    return `CK-${nik}`;
  };
  async create(createUsersDto: CreateUsersDto) {
    try {
      const users = await this.prisma.$queryRaw<Users[]>`SELECT * FROM "Users"`;

      const dt = {
        nik: this.generateNIK(users.length),
        password: await bcrypt.hash(createUsersDto.password, saltOrRounds),
        name: createUsersDto.name,
        role: { connect: { id: createUsersDto.roleId } },
        coop: { connect: { id: createUsersDto.coopId } },
        email: createUsersDto.email,
        phone: createUsersDto.phone,
        avatar: createUsersDto.avatar,
      };

      return this.prisma.users.create({
        data: dt,
      });
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateUsersDto: UpdateUsersDto) {
    try {
      const data = {
        name: updateUsersDto.name,
        roleId: updateUsersDto.roleId,
        coopId: updateUsersDto.coopId,
        email: updateUsersDto.email,
        phone: updateUsersDto.phone,
        avatar: updateUsersDto.avatar,
      };
      return this.prisma.users.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.users.update({
        where: { id },
        data: { is_active: false },
      });
    } catch (error) {
      throw error;
    }
  }
}

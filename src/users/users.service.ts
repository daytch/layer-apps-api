import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
// import { randomstring } from '../utils/randomizer.utils';
import * as bcrypt from 'bcrypt';

export type User = any;
const saltOrRounds = 12;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string, pass: string): Promise<User | undefined> {
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
    return user;
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
      const users = await this.prisma.$queryRaw<User[]>`SELECT * FROM "Users"`;

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

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUsersDto } from './dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-users.dto';
// import { randomstring } from '../utils/randomizer.utils';
import * as bcrypt from 'bcrypt';
import { Users } from '@prisma/client';

const saltOrRounds = 12;

export interface ICoop {
  coopId: number;
  coop_name: string;
}

export interface IUser {
  id: number;
  nik: string;
  name: string;
  roleId: number;
  coops: ICoop[];
  email: string;
  phone: string;
  avatar: string;
  is_active: boolean;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.users.findMany({
      select: {
        email: true,
        id: true,
        avatar: true,
        nik: true,
        name: true,
        phone: true,
        is_active: true,
        role: {
          select: { name: true },
        },
      },
    });
    const coops = await this.prisma.userCoop.findMany({
      select: {
        coopId: true,
        userId: true,
        coop: {
          select: {
            name: true,
          },
        },
      },
    });
    return users.map((item) => {
      const c = coops
        .filter((x) => x.userId === item.id)
        .map((i) => {
          return <ICoop>{ coopId: i.coopId, coop_name: i.coop.name };
        });
      return {
        email: item.email,
        id: item.id,
        avatar: item.avatar,
        nik: item.nik,
        name: item.name,
        phone: item.phone,
        is_active: item.is_active,
        role_name: item.role.name,
        coops: c,
      };
    });
  }

  async findProfile(id: number): Promise<IUser | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        nik: true,
        name: true,
        roleId: true,
        email: true,
        phone: true,
        avatar: true,
        is_active: true,
      },
    });

    const coops = await this.prisma.userCoop.findMany({
      where: { userId: user.id },
      select: {
        coopId: true,
        userId: true,
        coop: {
          select: {
            name: true,
          },
        },
      },
    });
    const c = coops.map((item) => {
      return <ICoop>{
        coopId: item.coopId,
        coop_name: item.coop.name,
      };
    });
    return { ...user, coops: c };
  }

  async getAllActiveUsers(): Promise<IUser[] | undefined> {
    const users = await this.prisma.users.findMany({
      where: { is_active: true },
      select: {
        id: true,
        nik: true,
        name: true,
        roleId: true,
        email: true,
        phone: true,
        avatar: true,
        is_active: true,
      },
    });

    const coops = await this.prisma.userCoop.findMany({
      select: {
        coopId: true,
        userId: true,
        coop: {
          select: {
            name: true,
          },
        },
      },
    });
    return users.map((item) => {
      const c = coops
        .filter((x) => x.userId === item.id)
        .map((i) => {
          return <ICoop>{ coopId: i.coopId, coop_name: i.coop.name };
        });
      return <IUser>{ ...item, coops: c };
    });
  }

  async findOneById(id: number): Promise<IUser | undefined> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }
    const coops = await this.prisma.userCoop.findMany({
      select: {
        coopId: true,
        userId: true,
        coop: {
          select: {
            name: true,
          },
        },
      },
    });
    return <IUser>{
      id: user.id,
      nik: user.nik,
      name: user.name,
      roleId: user.roleId,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      is_active: user.is_active,
      coops: coops.map((i) => {
        return <ICoop>{ coopId: i.coopId, coop_name: i.coop.name };
      }),
    };
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
    const coops = await this.prisma.userCoop.findMany({
      where: { userId: user.id },
      select: {
        coopId: true,
        userId: true,
        coop: {
          select: {
            name: true,
          },
        },
      },
    });
    return <IUser>{
      id: user.id,
      nik: user.nik,
      name: user.name,
      roleId: user.roleId,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      is_active: user.is_active,
      coops: coops.map((i) => {
        return <ICoop>{ coopId: i.coopId, coop_name: i.coop.name };
      }),
    };
  }

  generateNIK = (lastId: number) => {
    let nik = `${lastId + 1}`;
    while (nik.length < 3) {
      nik = '0' + nik;
    }
    return `CK-${nik}`;
  };

  async create(createUsersDto: CreateUsersDto) {
    try {
      const lastId = await this.prisma
        .$queryRaw<number>`SELECT id FROM "Users" order by id desc limit 1`;
      const user = await this.prisma.users.findMany({
        where: {
          OR: [
            { email: createUsersDto.email },
            { phone: createUsersDto.phone },
          ],
        },
      });
      if (user.length > 0) {
        throw new Error('Email / Nomor HP sudah terdaftar');
      }

      const dt = {
        nik: this.generateNIK(lastId[0].id),
        password: await bcrypt.hash(createUsersDto.password, saltOrRounds),
        name: createUsersDto.name,
        role: { connect: { id: createUsersDto.roleId } },
        email: createUsersDto.email,
        phone: createUsersDto.phone,
        avatar: createUsersDto.avatar,
      };
      const u = await this.prisma.users.create({
        data: dt,
      });

      if (createUsersDto.coopId.length > 0) {
        const data = createUsersDto.coopId?.map((itm) => {
          return {
            userId: u.id,
            coopId: itm,
          };
        });
        await this.prisma.userCoop.createMany({ data: data });
      }
      return this.prisma.users.create({
        data: dt,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateUsersDto: UpdateUsersDto) {
    try {
      await this.prisma.userCoop.deleteMany({ where: { userId: id } });
      const dataUserCoop = [];
      for (let idx = 0; idx < updateUsersDto?.coopId?.length; idx++) {
        dataUserCoop.push({
          userId: id,
          coopId: Number(updateUsersDto?.coopId[idx]),
        });
      }
      await this.prisma.userCoop.createMany({
        data: dataUserCoop,
        skipDuplicates: true,
      });
      if (updateUsersDto.password) {
        const password = await bcrypt.hash(
          updateUsersDto.password,
          saltOrRounds,
        );
        return await this.prisma.users.update({
          where: { id },
          data: {
            name: updateUsersDto.name,
            email: updateUsersDto.email,
            password,
            phone: updateUsersDto.phone,
            avatar: updateUsersDto.avatar,
            roleId: updateUsersDto.roleId,
          },
        });
      } else {
        return await this.prisma.users.update({
          where: { id },
          data: {
            name: updateUsersDto.name,
            email: updateUsersDto.email,
            phone: updateUsersDto.phone,
            avatar: updateUsersDto.avatar,
            roleId: updateUsersDto.roleId,
          },
        });
      }
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

import { PrismaClient, Users as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltOrRounds = 12;

interface SeedUser {
  id: number;
  nik: string;
  name: string;
  roleId: number;
  email: string;
  phone: string;
  password: string;
  is_active: boolean;
}

export class User {
  private users: SeedUser[] = [
    {
      id: 1,
      nik: 'CK-001',
      name: 'Superadmin',
      roleId: 1,
      email: 'me@nurulhidayat.com',
      phone: '085866661326',
      password: 'superadmin123',
      is_active: true,
    },
    {
      id: 2,
      nik: 'CK-002',
      name: 'Admin',
      roleId: 2,
      email: 'admin@yopmail.com',
      phone: '085866661326',
      password: 'admin123',
      is_active: true,
    },
    {
      id: 3,
      nik: 'CK-003',
      name: 'Mandor',
      roleId: 3,
      email: 'mandor@yopmail.com',
      phone: '085866661326',
      password: 'mandor123',
      is_active: true,
    },
    {
      id: 4,
      nik: 'CK-004',
      name: 'Anak Kandang',
      roleId: 4,
      email: 'anak_kandang@yopmail.com',
      phone: '085866661326',
      password: 'anakkandang123',
      is_active: true,
    },
  ];

  async seedData(): Promise<UserModel> {
    let superAdmin: UserModel | null = null;

    for (const u of this.users) {
      const hashedPassword = await bcrypt.hash(u.password, saltOrRounds);

      const user = await prisma.users.upsert({
        where: { id: u.id },
        update: {},
        create: {
          nik: u.nik,
          name: u.name,
          roleId: u.roleId,
          email: u.email,
          phone: u.phone,
          password: hashedPassword,
          is_active: u.is_active,
        },
      });

      if (u.id === 1) {
        superAdmin = user;
      }
    }

    // return user Superadmin untuk relasi UserCoop
    return superAdmin as UserModel;
  }
}

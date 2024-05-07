import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 12;
const prisma = new PrismaClient();

export class User {
  async seedData() {
    await prisma.users.upsert({
      where: { id: 1 },
      update: {},
      create: {
        password: await bcrypt.hash('superadmin123', saltOrRounds),
        nik: 'CK-001',
        name: 'Superadmin',
        roleId: 1,
        coopId: 1,
        email: 'me@nurulhidayat.com',
        phone: '085866661326',
        is_active: true,
      },
    });
    await prisma.users.upsert({
      where: { id: 2 },
      update: {},
      create: {
        password: await bcrypt.hash('admin123', saltOrRounds),
        nik: 'CK-002',
        name: 'Admin',
        roleId: 2,
        coopId: 1,
        email: 'admin@yopmail.com',
        phone: '085866661326',
        is_active: true,
      },
    });
    await prisma.users.upsert({
      where: { id: 3 },
      update: {},
      create: {
        password: await bcrypt.hash('mandor123', saltOrRounds),
        nik: 'CK-003',
        name: 'Mandor',
        roleId: 3,
        coopId: 1,
        email: 'mandor@yopmail.com',
        phone: '085866661326',
        is_active: true,
      },
    });
    await prisma.users.upsert({
      where: { id: 4 },
      update: {},
      create: {
        password: await bcrypt.hash('anakkandang123', saltOrRounds),
        nik: 'CK-004',
        name: 'Anak Kandang',
        roleId: 4,
        coopId: 1,
        email: 'anak_kandang@yopmail.com',
        phone: '085866661326',
        is_active: true,
      },
    });
  
  }
}

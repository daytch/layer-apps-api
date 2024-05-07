import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Role {
  async seedData() {
    await prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: { name: 'Superadmin' },
    });
    await prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: { name: 'Admin' },
    });
    await prisma.role.upsert({
      where: { id: 3 },
      update: {},
      create: { name: 'Mandor' },
    });
    await prisma.role.upsert({
      where: { id: 4 },
      update: {},
      create: { name: 'Anak Kandang' },
    });
  }
}

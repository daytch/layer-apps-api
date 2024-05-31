import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCoop {
  async seedData() {
    await prisma.userCoop.upsert({
      where: { id: 1 },
      update: {},
      create: { userId: 3, coopId: 1 },
    });
    await prisma.userCoop.upsert({
      where: { id: 2 },
      update: {},
      create: { userId: 3, coopId: 2 },
    });
    await prisma.userCoop.upsert({
      where: { id: 3 },
      update: {},
      create: { userId: 3, coopId: 3 },
    });
    await prisma.userCoop.upsert({
      where: { id: 4 },
      update: {},
      create: { userId: 4, coopId: 1 },
    });
  }
}

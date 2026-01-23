import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCoop {
  async seedData(userId: number, coopId: number) {
    await prisma.userCoop.upsert({
      where: {
        // pakai kombinasi userId + coopId biar unik
        userId_coopId: {
          userId,
          coopId,
        },
      },
      update: {},
      create: {
        userId,
        coopId,
      },
    });
  }
}

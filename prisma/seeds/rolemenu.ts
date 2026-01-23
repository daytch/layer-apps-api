import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Rolemenu {
  async seedData() {
    await prisma.roleMenu.upsert({
      where: { id: 1 },
      update: {},
      create: { roleId: 1, menuId: 1 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 2 },
      update: {},
      create: { roleId: 1, menuId: 2 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 3 },
      update: {},
      create: { roleId: 1, menuId: 3 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 4 },
      update: {},
      create: { roleId: 1, menuId: 4 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 5 },
      update: {},
      create: { roleId: 1, menuId: 5 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 6 },
      update: {},
      create: { roleId: 1, menuId: 6 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 7 },
      update: {},
      create: { roleId: 1, menuId: 7 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 8 },
      update: {},
      create: { roleId: 1, menuId: 8 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 9 },
      update: {},
      create: { roleId: 1, menuId: 9 },
    });
    // admin
    await prisma.roleMenu.upsert({
      where: { id: 10 },
      update: {},
      create: { roleId: 2, menuId: 1 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 11 },
      update: {},
      create: { roleId: 2, menuId: 2 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 12 },
      update: {},
      create: { roleId: 2, menuId: 3 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 13 },
      update: {},
      create: { roleId: 2, menuId: 4 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 14 },
      update: {},
      create: { roleId: 2, menuId: 5 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 15 },
      update: {},
      create: { roleId: 2, menuId: 6 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 16 },
      update: {},
      create: { roleId: 2, menuId: 7 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 17 },
      update: {},
      create: { roleId: 2, menuId: 9 },
    });
    // mandor
    await prisma.roleMenu.upsert({
      where: { id: 18 },
      update: {},
      create: { roleId: 3, menuId: 1 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 19 },
      update: {},
      create: { roleId: 3, menuId: 3 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 20 },
      update: {},
      create: { roleId: 3, menuId: 6 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 21 },
      update: {},
      create: { roleId: 3, menuId: 7 },
    });
    // anak kandang
    await prisma.roleMenu.upsert({
      where: { id: 22 },
      update: {},
      create: { roleId: 4, menuId: 1 },
    });
    await prisma.roleMenu.upsert({
      where: { id: 23 },
      update: {},
      create: { roleId: 4, menuId: 7 },
    });
  }
}

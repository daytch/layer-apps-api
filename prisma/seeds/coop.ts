import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Coop {
  async seedData() {
    await prisma.coop.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'Kandang Belakang MTS',
        nik: '1CKMTS',
        address: 'Kandang Belakang MTS',
      },
    });
    await prisma.coop.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'Kandang Belakang Lapangan',
        nik: '2CKLAP',
        address: 'Kandang Belakang Lapangan',
      },
    });
    await prisma.coop.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Kandang Jatisari A',
        nik: '3CKJTSA',
        address: 'Kandang Jatisari A',
      },
    });
    await prisma.coop.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Kandang Jatisari B',
        nik: '4CKJTSB',
        address: 'Kandang Jatisari B',
      },
    });
    await prisma.coop.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Kandang Mbungkus',
        nik: '5CKBKS',
        address: 'Kandang Mbungkus',
      },
    });
    await prisma.coop.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'Kandang Sukorejo',
        nik: '6CKSKH',
        address: 'Kandang Sukorejo',
      },
    });
  }
}

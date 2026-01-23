import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Menu {
  async seedData() {
    await prisma.menu.upsert({
      where: { id: 1 },
      update: {},
      create: { title: 'Dashboard', seq: 1, path: '/dashboard' },
    });
    await prisma.menu.upsert({
      where: { id: 2 },
      update: {},
      create: { title: 'Produksi Telur', seq: 2, path: '/produksitelur' },
    });
    await prisma.menu.upsert({
      where: { id: 3 },
      update: {},
      create: { title: 'Stok Pakan & Obat', seq: 3, path: '/stokpakanobat' },
    });
    await prisma.menu.upsert({
      where: { id: 4 },
      update: {},
      create: { title: 'Laporan Hasil Bulanan', seq: 4, path: '/laporan' },
    });
    await prisma.menu.upsert({
      where: { id: 5 },
      update: {},
      create: { title: 'Grafik FCR Harian', seq: 5, path: '/grafik' },
    });
    await prisma.menu.upsert({
      where: { id: 6 },
      update: {},
      create: { title: 'Diagnosis Kandang', seq: 6, path: '/diagnosis' },
    });
    await prisma.menu.upsert({
      where: { id: 7 },
      update: {},
      create: { title: 'SOP Kandang', seq: 7, path: '/sop' },
    });
    await prisma.menu.upsert({
      where: { id: 8 },
      update: {},
      create: { title: 'Cashflow', seq: 8, path: '/cashflow' },
    });
    await prisma.menu.upsert({
      where: { id: 9 },
      update: {},
      create: { title: 'User Management', seq: 9, path: '/users' },
    });
  }
}

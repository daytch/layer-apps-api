// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create roles
  const superadmin = await prisma.role.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Superadmin' },
  });
  const admin = await prisma.role.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Admin' },
  });
  const mandor = await prisma.role.upsert({
    where: { id: 3 },
    update: {},
    create: { name: 'Mandor' },
  });
  const anakkandang = await prisma.role.upsert({
    where: { id: 4 },
    update: {},
    create: { name: 'Anak Kandang' },
  });

  // create menu
  const dashboard = await prisma.menu.upsert({
    where: { id: 1 },
    update: {},
    create: { title: 'Dashboard', seq: 1, path: '/dashboard' },
  });
  const produksitelur = await prisma.menu.upsert({
    where: { id: 2 },
    update: {},
    create: { title: 'Produksi Telur', seq: 2, path: '/produksitelur' },
  });
  const stokpakanobat = await prisma.menu.upsert({
    where: { id: 3 },
    update: {},
    create: { title: 'Stok Pakan & Obat', seq: 3, path: '/stokpakanobat' },
  });
  const laporanbulanan = await prisma.menu.upsert({
    where: { id: 4 },
    update: {},
    create: { title: 'Laporan Hasil Bulanan', seq: 4, path: '/laporan' },
  });
  const grafikfcr = await prisma.menu.upsert({
    where: { id: 5 },
    update: {},
    create: { title: 'Grafik FCR Harian', seq: 5, path: '/grafik' },
  });
  const diagnosiskandang = await prisma.menu.upsert({
    where: { id: 6 },
    update: {},
    create: { title: 'Diagnosis Kandang', seq: 6, path: '/diagnosis' },
  });
  const sop = await prisma.menu.upsert({
    where: { id: 7 },
    update: {},
    create: { title: 'SOP Kandang', seq: 7, path: '/sop' },
  });
  const cashflow = await prisma.menu.upsert({
    where: { id: 8 },
    update: {},
    create: { title: 'Cashflow', seq: 8, path: '/cashflow' },
  });
  const usermanagement = await prisma.menu.upsert({
    where: { id: 9 },
    update: {},
    create: { title: 'User Management', seq: 9, path: '/users' },
  });

  // create roleMenu
  const rm1 = await prisma.roleMenu.upsert({
    where: { id: 1 },
    update: {},
    create: { roleId: 1, menuId: 1 },
  });
  const rm2 = await prisma.roleMenu.upsert({
    where: { id: 2 },
    update: {},
    create: { roleId: 1, menuId: 2 },
  });
  const rm3 = await prisma.roleMenu.upsert({
    where: { id: 3 },
    update: {},
    create: { roleId: 1, menuId: 3 },
  });
  const rm4 = await prisma.roleMenu.upsert({
    where: { id: 4 },
    update: {},
    create: { roleId: 1, menuId: 4 },
  });
  const rm5 = await prisma.roleMenu.upsert({
    where: { id: 5 },
    update: {},
    create: { roleId: 1, menuId: 5 },
  });
  const rm6 = await prisma.roleMenu.upsert({
    where: { id: 6 },
    update: {},
    create: { roleId: 1, menuId: 6 },
  });
  const rm7 = await prisma.roleMenu.upsert({
    where: { id: 7 },
    update: {},
    create: { roleId: 1, menuId: 7 },
  });
  const rm8 = await prisma.roleMenu.upsert({
    where: { id: 8 },
    update: {},
    create: { roleId: 1, menuId: 8 },
  });
  const rm9 = await prisma.roleMenu.upsert({
    where: { id: 9 },
    update: {},
    create: { roleId: 1, menuId: 9 },
  });

  console.log({
    superadmin,
    admin,
    mandor,
    anakkandang,
    dashboard,
    produksitelur,
    stokpakanobat,
    laporanbulanan,
    grafikfcr,
    diagnosiskandang,
    sop,
    cashflow,
    usermanagement,
    rm1,
    rm2,
    rm3,
    rm4,
    rm5,
    rm6,
    rm7,
    rm8,
    rm9,
  });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

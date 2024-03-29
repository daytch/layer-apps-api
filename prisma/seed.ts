/* eslint-disable @typescript-eslint/no-unused-vars */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const saltOrRounds = 12;

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

  // create kandang / Coop
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

  // create user
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

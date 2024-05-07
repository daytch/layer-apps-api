import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class SOP {
  async seedData() {
    await prisma.sOP.upsert({
      where: { id: 1 },
      update: {},
      create: {
        roleId: 4,
        title: 'Anak kandang cek ketebalan pakan',
        description: 'Anak kandang cek ketebalan pakan',
        time: '05.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 2 },
      update: {},
      create: {
        roleId: 4,
        title: 'Anak kandang berikan pakan (pagi)',
        description: 'Anak kandang berikan pakan (pagi)',
        time: '05.30 - 06.30 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 3 },
      update: {},
      create: {
        roleId: 4,
        title: 'Anak kandang cuci pipa minum dan bersih-bersih lantai kandang',
        description:
          'Anak kandang cuci pipa minum dan bersih-bersih lantai kandang',
        time: '06.15 - 07.30 WIBF',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 4 },
      update: {},
      create: {
        roleId: 4,
        title: 'Istirahat pagi',
        description: 'Istirahat pagi',
        time: '07.30 - 08.30 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 5 },
      update: {},
      create: {
        roleId: 4,
        title: 'Gorek pakan pagi',
        description: 'Gorek pakan pagi',
        time: '08.30 - 09.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 6 },
      update: {},
      create: {
        roleId: 4,
        title: 'Ambil Telur + Packing',
        description: 'Ambil Telur + Packing',
        time: '09.00 - 11.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 7 },
      update: {},
      create: {
        roleId: 4,
        title: 'Anak kandang berikan pakan (Siang)',
        description: 'Anak kandang berikan pakan (Siang)',
        time: '11.00 - 12.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 8 },
      update: {},
      create: {
        roleId: 4,
        title: 'Istirahat siang',
        description: 'Istirahat siang',
        time: '12.00 - 13.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 9 },
      update: {},
      create: {
        roleId: 4,
        title: 'Gorek pakan siang',
        description: 'Gorek pakan siang',
        time: '05.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 10 },
      update: {},
      create: {
        roleId: 4,
        title: 'Anak kandang takar pakan untuk besok paginya',
        description: 'Anak kandang takar pakan untuk besok paginya',
        time: '13.30 - 14.30 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 11 },
      update: {},
      create: {
        roleId: 4,
        title: 'Anak kandang bersih-bersih lantai kandang dan langit-langit',
        description:
          'Anak kandang bersih-bersih lantai kandang dan langit-langit',
        time: '14.30 - 15.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 12 },
      update: {},
      create: {
        roleId: 4,
        title: 'Gorek pakan sore',
        description: 'Gorek pakan sore',
        time: '15.00 - 15.30 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 13 },
      update: {},
      create: {
        roleId: 4,
        title: 'Ambil telur sisa pagi yang belum bertelur',
        description: 'Ambil telur sisa pagi yang belum bertelur',
        time: '15.30 - 16.30 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 14 },
      update: {},
      create: {
        roleId: 4,
        title: 'Gorek pakan malam',
        description: 'Gorek pakan malam',
        time: '17.30 - 18.00 WIB',
      },
    });

    // mandor
    await prisma.sOP.upsert({
      where: { id: 15 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek sampling ayam (ayam ngorok, cekrek, sakit dll)',
        description:
          'Mandor cek sampling ayam (ayam ngorok, cekrek, sakit dll)',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 16 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek keberishan pipa minum (kebersihan dan kondisi pipa)',
        description:
          'Mandor cek keberishan pipa minum (kebersihan dan kondisi pipa)',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 17 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek pipa makanan (ketebalan makanan & keberihan)',
        description: 'Mandor cek pipa makanan (ketebalan makanan & keberihan)',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 18 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek stock pakan dan obat-obatan',
        description: 'Mandor cek stock pakan dan obat-obatan',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 19 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek sanitasi air dan filter air',
        description: 'Mandor cek sanitasi air dan filter air',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 20 },
      update: {},
      create: {
        roleId: 3,
        title:
          'Mandor cek bio security dan kebersihan lingkungan (termasuk kondisi lalat, kebersihan gudang, lingkungan sekitar kandang & keberishan langit-langit kandang',
        description:
          'Mandor cek bio security dan kebersihan lingkungan (termasuk kondisi lalat, kebersihan gudang, lingkungan sekitar kandang & keberishan langit-langit kandang',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 21 },
      update: {},
      create: {
        roleId: 3,
        title:
          'Mandor cek kekeringan kotoran & kontrol bau kotoran. Lakukan tindakan segara apabila ada tanda bau, banyak belatung dan kotoran basah.',
        description:
          'Mandor cek kekeringan kotoran & kontrol bau kotoran. Lakukan tindakan segara apabila ada tanda bau, banyak belatung dan kotoran basah.',
        time: '06.00 - 08.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 22 },
      update: {},
      create: {
        roleId: 3,
        title:
          'Mandor breaving dengan anak kandang terkait kondisi ayam, pemberian tindakan ayam (penyuntikan obat dan tindakan lainya) porsi pemberian pakan, kebersihan pipa pakan, kebersihan pipa air dan pemberian pakan',
        description:
          'Mandor breaving dengan anak kandang terkait kondisi ayam, pemberian tindakan ayam (penyuntikan obat dan tindakan lainya) porsi pemberian pakan, kebersihan pipa pakan, kebersihan pipa air dan pemberian pakan',
        time: '08.00 - 09.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 23 },
      update: {},
      create: {
        roleId: 3,
        title:
          'Mandor melaksanakan recording hasil produksi kandang dan cek kesesuaian hasil produksi telur',
        description:
          'Mandor melaksanakan recording hasil produksi kandang dan cek kesesuaian hasil produksi telur',
        time: '16.00 - 17.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 24 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek lighting ayam dengan ketentuan sesuai manual book',
        description:
          'Mandor cek lighting ayam dengan ketentuan sesuai manual book',
        time: '17.00 - 18.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 25 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor cek jadwal vaksin dan koordinasikan dengan PPL',
        description: 'Mandor cek jadwal vaksin dan koordinasikan dengan PPL',
        time: '17.00 - 18.00 WIB',
      },
    });
    await prisma.sOP.upsert({
      where: { id: 26 },
      update: {},
      create: {
        roleId: 3,
        title: 'Mandor melaporkan hasil monitoring berkala kepada owner',
        description: 'Mandor melaporkan hasil monitoring berkala kepada owner',
        time: '18.00 - 19.00 WIB',
      },
    });
  }
}

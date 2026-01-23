import { PrismaClient, Coop as CoopModel } from '@prisma/client';

const prisma = new PrismaClient();

interface SeedCoop {
  id: number;
  name: string;
  nik: string;
  address: string;
}

export class Coop {
  private coops: SeedCoop[] = [
    {
      id: 1,
      name: 'Kandang Belakang MTS',
      nik: '1CKMTS',
      address: 'Kandang Belakang MTS',
    },
    {
      id: 2,
      name: 'Kandang Belakang Lapangan',
      nik: '2CKLAP',
      address: 'Kandang Belakang Lapangan',
    },
    {
      id: 3,
      name: 'Kandang Jatisari A',
      nik: '3CKJTSA',
      address: 'Kandang Jatisari A',
    },
    {
      id: 4,
      name: 'Kandang Jatisari B',
      nik: '4CKJTSB',
      address: 'Kandang Jatisari B',
    },
    {
      id: 5,
      name: 'Kandang Mbungkus',
      nik: '5CKBKS',
      address: 'Kandang Mbungkus',
    },
    {
      id: 6,
      name: 'Kandang Sukorejo',
      nik: '6CKSKH',
      address: 'Kandang Sukorejo',
    },
  ];

  async seedData(): Promise<CoopModel> {
    let firstCoop: CoopModel | null = null;

    for (const c of this.coops) {
      const coop = await prisma.coop.upsert({
        where: { id: c.id },
        update: {},
        create: {
          name: c.name,
          nik: c.nik,
          address: c.address,
        },
      });

      if (c.id === 1) {
        firstCoop = coop;
      }
    }

    // return coop pertama untuk dipakai di relasi UserCoop
    return firstCoop as CoopModel;
  }
}

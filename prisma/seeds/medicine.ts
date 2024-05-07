import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class Medicine {
  async seedData() {
    await prisma.feedsMedicines.upsert({
      where: { id: 1 },
      update: {},
      create: {
        SKU: 'G100000000851',
        coopId: 1,
        name: 'Stres Block',
        userId: 1,
        quantity: 12,
        uom: 'pcs',
        price: 12100,
        total: 121000,
      },
    });
    await prisma.feedsMedicines.upsert({
      where: { id: 2 },
      update: {},
      create: {
        SKU: 'G100000000852',
        coopId: 1,
        name: 'Trimezyn Serbuk',
        userId: 1,
        quantity: 10,
        uom: 'pcs',
        price: 32600,
        total: 326000,
      },
    });
    await prisma.feedsMedicines.upsert({
      where: { id: 3 },
      update: {},
      create: {
        SKU: 'G100000000853',
        coopId: 1,
        name: 'Kututox Spray',
        userId: 1,
        quantity: 1,
        uom: 'botol',
        price: 109000,
        total: 109000,
      },
    });
    await prisma.feedsMedicines.upsert({
      where: { id: 4 },
      update: {},
      create: {
        SKU: 'G100000000854',
        coopId: 1,
        name: 'Aminovit 100g',
        userId: 1,
        quantity: 10,
        uom: 'pcs',
        price: 18250,
        total: 182500,
      },
    });
    await prisma.feedsMedicines.upsert({
      where: { id: 5 },
      update: {},
      create: {
        SKU: 'G100000000855',
        coopId: 1,
        name: 'FIN LA 536',
        userId: 1,
        quantity: 3000,
        uom: 'pcs',
        price: 7300,
        total: 21900000,
      },
    });
  }
}

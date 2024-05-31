/* eslint-disable @typescript-eslint/no-unused-vars */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { Role } from './seeds/role';
import { Menu } from './seeds/menu';
import { Rolemenu } from './seeds/rolemenu';
import { Coop } from './seeds/coop';
import { User } from './seeds/user';
import { SOP } from './seeds/sop';
import { Medicine } from './seeds/medicine';
import { UserCoop } from './seeds/usercoop';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create roles
  const role = new Role();
  await role.seedData();

  // create menu
  const menu = new Menu();
  await menu.seedData();

  // create roleMenu
  const rolemenu = new Rolemenu();
  await rolemenu.seedData();

  // create kandang / Coop
  const coop = new Coop();
  await coop.seedData();

  // create user
  const user = new User();
  await user.seedData();

  // create userCoop
  const userCoop = new UserCoop();
  await userCoop.seedData();

  // SOP
  const sop = new SOP();
  await sop.seedData();

  //medicine
  const medicine = new Medicine();
  await medicine.seedData();
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

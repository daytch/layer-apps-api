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
  console.log('🌱 Start seeding...');

  // 1. Role
  const role = new Role();
  await role.seedData();
  console.log('✅ Roles seeded');

  // 2. Menu
  const menu = new Menu();
  await menu.seedData();
  console.log('✅ Menus seeded');

  // 3. RoleMenu (needs role + menu)
  const rolemenu = new Rolemenu();
  await rolemenu.seedData();
  console.log('✅ RoleMenus seeded');

  // 4. Coop
  const coop = new Coop();
  const coopData = await coop.seedData();
  console.log('✅ Coops seeded');

  // 5. User
  const user = new User();
  const userData = await user.seedData();
  console.log('✅ Users seeded');

  // 6. UserCoop (needs user + coop)
  if (userData?.id && coopData?.id) {
    const userCoop = new UserCoop();
    await userCoop.seedData(userData.id, coopData.id);
    console.log('✅ UserCoops seeded');
  } else {
    console.warn('⚠️ Skip UserCoop seeding: user/coop missing');
  }

  // 7. SOP
  const sop = new SOP();
  await sop.seedData();
  console.log('✅ SOPs seeded');

  // 8. Medicine
  const medicine = new Medicine();
  await medicine.seedData();
  console.log('✅ Medicines seeded');

  console.log('🎉 Seeding finished.');
}

// execute the main function
main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

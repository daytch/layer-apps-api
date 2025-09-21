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

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  try {
    // 1. Role
    await new Role().seedData();
    console.log('✅ Roles seeded');

    // 2. Menu
    await new Menu().seedData();
    console.log('✅ Menus seeded');

    // 3. RoleMenu
    await new Rolemenu().seedData();
    console.log('✅ RoleMenus seeded');

    // 4. Coop
    const coopData = await new Coop().seedData();
    console.log('✅ Coops seeded');

    // 5. User
    const userData = await new User().seedData();
    console.log('✅ Users seeded');

    // 6. UserCoop (relation)
    if (userData && coopData) {
      const userCoop = new UserCoop();
      await userCoop.seedData(userData.id, coopData.id);
      console.log('✅ UserCoops seeded');
    } else {
      console.warn('⚠️ Skip UserCoop seeding: user/coop missing');
    }

    // 7. SOP
    await new SOP().seedData();
    console.log('✅ SOPs seeded');

    // 8. Medicine
    await new Medicine().seedData();
    console.log('✅ Medicines seeded');

    console.log('🎉 Seeding finished.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

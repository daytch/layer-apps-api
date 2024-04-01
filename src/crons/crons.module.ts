import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SopModule } from '../sop/sop.module';

@Module({
  imports: [PrismaModule, UsersModule, SopModule],
  providers: [CronsService],
})
export class CronsModule {}

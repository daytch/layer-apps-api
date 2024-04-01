import { Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { SopModule } from 'src/sop/sop.module';

@Module({
  imports: [PrismaModule, UsersModule, SopModule],
  providers: [CronsService],
})
export class CronsModule {}

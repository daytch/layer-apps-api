import { forwardRef, Module } from '@nestjs/common';
import { CronsService } from './crons.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { SopModule } from '../sop/sop.module';

@Module({
  imports: [PrismaModule, UsersModule, forwardRef(() => SopModule)],
  providers: [CronsService],
  exports: [CronsService],
})
export class CronsModule {}

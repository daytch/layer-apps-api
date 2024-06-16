import { forwardRef, Module } from '@nestjs/common';
import { SopService } from './sop.service';
import { SopController } from './sop.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { CronsModule } from 'src/crons/crons.module';

@Module({
  imports: [PrismaModule, UsersModule, forwardRef(() => CronsModule)],
  controllers: [SopController],
  providers: [SopService, { provide: 'APP_GUARD', useClass: AuthGuard }],
  exports: [SopService],
})
export class SopModule {}

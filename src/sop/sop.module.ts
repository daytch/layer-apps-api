import { Module } from '@nestjs/common';
import { SopService } from './sop.service';
import { SopController } from './sop.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [SopController],
  providers: [SopService, { provide: 'APP_GUARD', useClass: AuthGuard }],
  exports: [SopService],
})
export class SopModule {}

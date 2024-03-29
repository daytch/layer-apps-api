import { Module } from '@nestjs/common';
import { CoopService } from './coop.service';
import { CoopController } from './coop.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [CoopController],
  providers: [CoopService, { provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class CoopModule {}

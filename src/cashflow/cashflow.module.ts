import { Module } from '@nestjs/common';
import { CashflowService } from './cashflow.service';
import { CashflowController } from './cashflow.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [CashflowController],
  providers: [CashflowService, { provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class CashflowModule {}

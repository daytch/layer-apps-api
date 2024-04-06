import { Module } from '@nestjs/common';
import { DiagnosticService } from './diagnostic.service';
import { DiagnosticController } from './diagnostic.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [DiagnosticController],
  providers: [DiagnosticService, { provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class DiagnosticModule {}

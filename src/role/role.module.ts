import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [RoleService, { provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class RoleModule {}

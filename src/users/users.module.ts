import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { PrismaModule } from '../prisma/prisma.module';
// import { AuthGuard } from '../auth/auth.guard';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      dest: './public/images',
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [UsersService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}

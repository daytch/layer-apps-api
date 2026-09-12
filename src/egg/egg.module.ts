import { Module } from '@nestjs/common';
import { EggService } from './egg.service';
import { EggController } from './egg.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { CoopModule } from '../coop/coop.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    MulterModule.register({
      dest: './public/docs',
    }),
    CoopModule,
  ],
  controllers: [EggController],
  providers: [EggService],
  exports: [EggService],
})
export class EggModule {}

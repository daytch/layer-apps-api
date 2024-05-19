import { Module } from '@nestjs/common';
import { EggService } from './egg.service';
import { EggController } from './egg.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { CoopModule } from 'src/coop/coop.module';

@Module({
  imports: [
    PrismaModule,
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

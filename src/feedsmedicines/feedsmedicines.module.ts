import { Module } from '@nestjs/common';
import { FeedsmedicinesService } from './feedsmedicines.service';
import { FeedsmedicinesController } from './feedsmedicines.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [FeedsmedicinesController],
  providers: [
    FeedsmedicinesService,
    { provide: 'APP_GUARD', useClass: AuthGuard },
  ],
})
export class FeedsmedicinesModule {}

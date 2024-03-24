import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthGuard } from '../auth/auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [RecipeController],
  providers: [RecipeService, { provide: 'APP_GUARD', useClass: AuthGuard }],
})
export class RecipeModule {}

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { RoleModule } from './role/role.module';
import { CoopModule } from './coop/coop.module';
import { CashflowModule } from './cashflow/cashflow.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
// import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { SopModule } from './sop/sop.module';
import { CronsModule } from './crons/crons.module';
import { ConfigModule } from '@nestjs/config';
import { DiagnosticModule } from './diagnostic/diagnostic.module';
import { FeedsmedicinesModule } from './feedsmedicines/feedsmedicines.module';
import { EggModule } from './egg/egg.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { NotificationModule } from './notification/notification.module';
import configuration from './configs/configuration';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `./${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    CronsModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'),
    }),
    RoleModule,
    CoopModule,
    CashflowModule,
    SopModule,
    DiagnosticModule,
    FeedsmedicinesModule,
    EggModule,
    DashboardModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: ErrorsInterceptor,
    // },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
  exports: [AppService],
})
export class AppModule {}

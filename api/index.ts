import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';

import { AppModule } from '../src/app.module';

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  const isProduction = nodeEnv === 'production';

  const corsOrigins = parseCorsOrigins(
    configService.get<string>('CORS_ORIGINS'),
  );

  if (isProduction && corsOrigins.includes('*')) {
    throw new Error(
      'CORS_ORIGINS tidak boleh menggunakan wildcard (*) pada production.',
    );
  }

  app.enableCors({
    origin: isProduction
      ? corsOrigins
      : corsOrigins.length > 0
        ? corsOrigins
        : true,

    credentials: true,

    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],

    allowedHeaders: [
      'Authorization',
      'Content-Type',
      'X-Client-Id',
      'X-Requested-With',
    ],

    optionsSuccessStatus: 204,
  });

  app.setGlobalPrefix('api');

  const expressInstance = app.getHttpAdapter().getInstance();

  expressInstance.disable('x-powered-by');

  app.use((_, response, next) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('Pragma', 'no-cache');

    response.setHeader('X-Content-Type-Options', 'nosniff');

    response.setHeader('X-Frame-Options', 'DENY');

    response.setHeader('Referrer-Policy', 'no-referrer');

    response.setHeader(
      'Permissions-Policy',
      'geolocation=(), microphone=(), camera=()',
    );

    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.init();

  cachedApp = app.getHttpAdapter().getInstance();

  console.log('======================================');
  console.log('LayerApps API initialized');
  console.log(`Environment : ${nodeEnv}`);
  console.log(`CORS Origins: ${corsOrigins.join(', ')}`);
  console.log('======================================');

  return cachedApp;
}

function parseCorsOrigins(value?: string): string[] {
  if (!value) {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://layer-apps.vercel.app/',
    ];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default async function handler(req: Request, res: Response) {
  const app = await bootstrap();

  return app(req, res);
}

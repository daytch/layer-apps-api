import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { getAbsoluteFSPath } from 'swagger-ui-dist';

import { AppModule } from '../src/app.module';

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);

  const expressInstance = app.getHttpAdapter().getInstance();

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

  // ================================
  // CORS
  // ================================

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

  // ================================
  // GLOBAL PREFIX
  // ================================

  app.setGlobalPrefix('api');

  // ================================
  // SECURITY
  // ================================

  expressInstance.disable('x-powered-by');

  expressInstance.use((_: Request, response: Response, next: () => void) => {
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

  // ================================
  // VALIDATION
  // ================================

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  // ================================
  // SWAGGER
  // ================================

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Layer Apps API')
    .setDescription('Layer Apps Description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, swaggerDocument, {
    useGlobalPrefix: false,

    customSwaggerUiPath: getAbsoluteFSPath(),

    customSiteTitle: 'Layer Apps API',
  });

  // ================================
  // INIT
  // ================================

  await app.init();

  cachedApp = app.getHttpAdapter().getInstance();

  console.log('======================================');
  console.log('LayerApps API initialized');
  console.log(`Environment : ${nodeEnv}`);
  console.log(`CORS Origins: ${corsOrigins.join(', ')}`);
  console.log('Swagger     : /docs');
  console.log('======================================');

  return cachedApp;
}

function parseCorsOrigins(value?: string): string[] {
  if (!value) {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://layer-apps.vercel.app',
    ];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await bootstrap();

    return app(req, res);
  } catch (err) {
    console.error('Bootstrap failed:', err);

    return res.status(500).json({
      message: 'Internal server error during initialization',
    });
  }
}

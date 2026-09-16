import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

import { ConfigService } from '@nestjs/config';
// import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  // =========================================================
  // STATIC ASSETS
  // =========================================================

  app.useStaticAssets(join(__dirname, '..', 'public/images'), {
    prefix: '/images',
  });

  // =========================================================
  // CORS
  // =========================================================

  const corsOrigins = parseCorsOrigins(
    configService.get<string>('CORS_ORIGINS'),
  );

  const isProduction = nodeEnv === 'production';

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

  // =========================================================
  // SECURITY HEADERS
  // =========================================================

  const expressInstance = app.getHttpAdapter().getInstance();

  expressInstance.disable('x-powered-by');

  expressInstance.use((_req: any, response: any, next: any) => {
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

  // =========================================================
  // GLOBAL API PREFIX
  // =========================================================

  app.setGlobalPrefix('api');

  // =========================================================
  // SWAGGER
  // =========================================================

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Layer Apps API')
    .setDescription('Layer Apps Description')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  // =========================================================
  // CLEAN PUBLIC SECURITY FROM SWAGGER
  // =========================================================

  Object.values((swaggerDocument as OpenAPIObject).paths).forEach(
    (path: any) => {
      Object.values(path).forEach((method: any) => {
        if (
          Array.isArray(method.security) &&
          method.security.includes('public')
        ) {
          method.security = [];
        }
      });
    },
  );

  // =========================================================
  // SWAGGER UI
  // =========================================================

  SwaggerModule.setup('docs', app, swaggerDocument, {
    useGlobalPrefix: false,
  });

  // =========================================================
  // VALIDATION
  // =========================================================

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     transform: true,
  //     forbidNonWhitelisted: true,
  //   }),
  // );

  // =========================================================
  // PORT
  // =========================================================

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);

  console.log('======================================');
  console.log('LayerApps API started');
  console.log(`Environment : ${nodeEnv}`);
  console.log(`Port        : ${port}`);
  console.log(`API         : http://localhost:${port}/api`);
  console.log(`Swagger     : http://localhost:${port}/docs`);
  console.log('======================================');
}

// =========================================================
// CORS PARSER
// =========================================================

function parseCorsOrigins(value?: string): string[] {
  if (!value) {
    return [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://layer-apps.vercel.app',
      'https://layerapps.garudacore.tech',
    ];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

bootstrap();

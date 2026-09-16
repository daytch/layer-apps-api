import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public/images'), {
    prefix: '/images',
  });
  // Konfigurasi CORS dengan opsi eksplisit untuk mendukung credentials & multi-origin jika diperlukan
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  console.log(`Application is running on port: ${port}`);

  // Setup Swagger Document Configuration
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Layer Apps API')
    .setDescription('Layer Apps Description')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Membersihkan security 'public' pada Swagger jika ada
  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes('public')
      ) {
        method.security = [];
      }
    });
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(port);

  console.log(`Application: http://localhost:${port}`);
  console.log(`Swagger: http://localhost:${port}/docs`);
}

bootstrap();

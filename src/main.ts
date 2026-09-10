import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}

bootstrap();

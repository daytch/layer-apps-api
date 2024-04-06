import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');

  // Use DocumentBuilder to create a new Swagger document configuration
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Layer Apps API')
    .setDescription('Layer Apps Description')
    .setVersion('0.1')
    .build();

  // Create a Swagger document using the application instance and the document configuration
  const document = SwaggerModule.createDocument(app, config);

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
  // Setup Swagger module with the application instance and the Swagger document
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ActivityPackage } from './activity-packages/schema/activity-package.schema';
import { DocumentTemplateDetail } from './document-template/schema/document-template.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable CORS
  app.enableCors();

  // initialize Swagger
  const config = new DocumentBuilder()
    .setTitle('EduRPA API')
    .setDescription('API for EduRPA')
    .setVersion('1.0')
    .addBearerAuth()
    .addOAuth2()
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ActivityPackage, DocumentTemplateDetail],
  });
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(8080);
}
bootstrap();

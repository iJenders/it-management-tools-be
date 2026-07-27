import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/infrastructure/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global DTO validation (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Strip unknown properties not declared in the DTO
      forbidNonWhitelisted: true, // Throw if unknown properties are sent
      transform: true,       // Auto-transform payloads to DTO class instances
    }),
  );

  // Global domain exception filter (maps plain Error → 400 Bad Request)
  app.useGlobalFilters(new DomainExceptionFilter());

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('IT Management Tools API')
    .setDescription(
      'DDD Hexagonal Architecture – Organization Context. ' +
      'Manages Employees, Management Units, Organization Units and IT Roles.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


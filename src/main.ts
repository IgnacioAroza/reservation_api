import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Reservations_API');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS
  // app.enableCors({
  //   origin: process.env.CORS_ORIGIN || '*',
  //   credentials: true,
  // });

  app.setGlobalPrefix('v1/api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Reservations API')
    .setDescription('Modular reservations and real-time availability API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'User management')
    .addTag('companies', 'Company management (multi-tenant)')
    .addTag('properties', 'Property management')
    .addTag('units', 'Unit management')
    .addTag('availability', 'Availability queries')
    .addTag('holds', 'Temporary reservations (holds)')
    .addTag('reservations', 'Reservation management')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Reservations API Docs',
    swaggerOptions: {
      persistAuthorization: true, // Mantiene el token entre recargas
    },
  });

  // Get port from config
  const port = envs.port;

  await app.listen(port);

  logger.log(`
  🚀 Application is running on: http://localhost:${port}
  📚 Swagger docs available at: http://localhost:${port}/docs
  🔗 API endpoints: http://localhost:${port}/v1/api/*
  `);
}

void bootstrap();

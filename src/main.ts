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

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Reservations API')
    .setDescription(
      'API modular de reservaciones y disponibilidad en tiempo real',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('companies', 'Gestión de compañías (multi-tenant)')
    .addTag('properties', 'Gestión de propiedades')
    .addTag('units', 'Gestión de unidades')
    .addTag('availability', 'Consulta de disponibilidad')
    .addTag('holds', 'Reservas temporales (holds)')
    .addTag('reservations', 'Gestión de reservas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Get port from config
  const port = envs.port;

  await app.listen(port);

  logger.log(`
  🚀 Application is running on: http://localhost:${port}
  📚 Swagger docs available at: http://localhost:${port}/api/docs
  `);
}

void bootstrap();

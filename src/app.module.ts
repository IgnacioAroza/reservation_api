import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto
      },
    ]),

    // Database & Cache
    PrismaModule,
    RedisModule,

    // Feature modules
    AuthModule,
    CompaniesModule,
    // UsersModule,
    // PropertiesModule,
    // etc.
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

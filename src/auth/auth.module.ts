import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';
import { CompaniesModule } from '../companies/companies.module';
import { envs } from '../config/envs';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: envs.jwtSecret,
      signOptions: {
        expiresIn: '7d',
      },
    }),
    PrismaModule,
    CompaniesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

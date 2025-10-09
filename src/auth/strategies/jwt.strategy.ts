import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { envs } from '../../config/envs';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    if (!user.company.isActive) {
      throw new UnauthorizedException('Company is inactive');
    }

    // This will be attached to request.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
      isActive: user.isActive,
      company: user.company,
    };
  }
}

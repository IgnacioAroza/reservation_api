import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'Company ID (UUID) that the user belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({
    description: 'User role in the system',
    enum: Role,
    example: Role.AGENT,
    default: Role.AGENT,
    required: false,
  })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}

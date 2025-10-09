import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.AGENT,
  })
  role: Role;

  @ApiProperty({
    description: 'Company ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  companyId: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-10-09T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-10-09T10:00:00.000Z',
  })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}

import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: Role,
    example: Role.AGENT,
  })
  role: Role;

  @ApiProperty({
    description: 'Company ID (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  companyId: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'User creation timestamp',
    example: '2025-10-10T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User last update timestamp',
    example: '2025-10-10T10:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Company information',
    required: false,
    example: {
      id: 'uuid-1',
      name: 'Acme Corporation',
      slug: 'acme-corporation',
    },
  })
  company?: {
    id: string;
    name: string;
    slug: string;
  };
}

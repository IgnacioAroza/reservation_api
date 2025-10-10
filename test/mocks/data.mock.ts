import { Role } from '@prisma/client';

export const mockCompany = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Acme Corporation',
  slug: 'acme-corporation',
  isActive: true,
  createdAt: new Date('2025-10-10T10:00:00.000Z'),
  updatedAt: new Date('2025-10-10T10:00:00.000Z'),
};

export const mockCompanyWithCounts = {
  ...mockCompany,
  _count: {
    users: 5,
    properties: 3,
  },
};

export const mockUser = {
  id: 'user-uuid-1234',
  email: 'john.doe@example.com',
  password: '$2a$10$hashedpassword',
  firstName: 'John',
  lastName: 'Doe',
  role: Role.AGENT,
  companyId: mockCompany.id,
  isActive: true,
  createdAt: new Date('2025-10-10T10:00:00.000Z'),
  updatedAt: new Date('2025-10-10T10:00:00.000Z'),
};

export const mockUserWithCompany = {
  ...mockUser,
  company: {
    id: mockCompany.id,
    name: mockCompany.name,
    slug: mockCompany.slug,
    isActive: mockCompany.isActive,
  },
};

export const mockAdmin = {
  id: 'admin-uuid-1234',
  email: 'admin@example.com',
  password: '$2a$10$hashedpassword',
  firstName: 'Admin',
  lastName: 'User',
  role: Role.ADMIN,
  companyId: mockCompany.id,
  isActive: true,
  createdAt: new Date('2025-10-10T10:00:00.000Z'),
  updatedAt: new Date('2025-10-10T10:00:00.000Z'),
};

export const mockViewer = {
  id: 'viewer-uuid-1234',
  email: 'viewer@example.com',
  password: '$2a$10$hashedpassword',
  firstName: 'Viewer',
  lastName: 'User',
  role: Role.VIEWER,
  companyId: mockCompany.id,
  isActive: true,
  createdAt: new Date('2025-10-10T10:00:00.000Z'),
  updatedAt: new Date('2025-10-10T10:00:00.000Z'),
};

export const mockUserWithoutPassword = {
  id: mockUser.id,
  email: mockUser.email,
  firstName: mockUser.firstName,
  lastName: mockUser.lastName,
  role: mockUser.role,
  companyId: mockUser.companyId,
  isActive: mockUser.isActive,
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
  company: {
    id: mockCompany.id,
    name: mockCompany.name,
    slug: mockCompany.slug,
  },
};

export const mockJwtPayload = {
  sub: mockUser.id,
  email: mockUser.email,
  role: mockUser.role,
  companyId: mockUser.companyId,
};

export const mockJwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken';

export const mockAuthResponse = {
  access_token: mockJwtToken,
  user: {
    id: mockUser.id,
    email: mockUser.email,
    firstName: mockUser.firstName,
    lastName: mockUser.lastName,
    role: mockUser.role,
    companyId: mockUser.companyId,
    isActive: mockUser.isActive,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  },
};

export const createMockUser = (overrides?: Partial<typeof mockUser>) => ({
  ...mockUser,
  ...overrides,
});

export const createMockCompany = (overrides?: Partial<typeof mockCompany>) => ({
  ...mockCompany,
  ...overrides,
});

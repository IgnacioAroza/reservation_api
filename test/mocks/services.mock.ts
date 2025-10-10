export const mockPrismaService = {
  company: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

export const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

export const mockCompaniesService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findBySlug: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

export const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  validateUser: jest.fn(),
  generateJwtToken: jest.fn(),
};

export const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  updatePassword: jest.fn(),
  remove: jest.fn(),
};

export const getMockPrismaService = () => ({
  company: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

export const getMockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
});

import {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import {
  mockUser,
  mockUserWithCompany,
  mockCompany,
  mockJwtToken,
} from '../../test/mocks/data.mock';
import {
  getMockPrismaService,
  getMockJwtService,
  mockCompaniesService,
} from '../../test/mocks/services.mock';
import { Test, TestingModule } from '@nestjs/testing';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: JwtService;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const mockPrisma = getMockPrismaService();
    const mockJwt = getMockJwtService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwt,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
    companiesService = module.get(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'newuser@example.com',
      password: 'SecurePass123',
      firstName: 'New',
      lastName: 'User',
      companyId: mockCompany.id,
      role: undefined,
    };

    it('should register a new user successfully', async () => {
      const newUser = {
        ...mockUserWithCompany,
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      mockCompaniesService.findOne.mockResolvedValue(mockCompany);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue(newUser);
      (jwtService.sign as jest.Mock).mockReturnValue(mockJwtToken);

      const result = await service.register(registerDto);

      expect(result.access_token).toBe(mockJwtToken);
      expect(result.user).toHaveProperty('email', registerDto.email);
      expect(result.user).not.toHaveProperty('password');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(companiesService.findOne).toHaveBeenCalledWith(
        registerDto.companyId,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should throw ConflictException if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if company not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      mockCompaniesService.findOne.mockResolvedValue(null);

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should default to AGENT role if not specified', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      mockCompaniesService.findOne.mockResolvedValue(mockCompany);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue(mockUserWithCompany);
      (jwtService.sign as jest.Mock).mockReturnValue(mockJwtToken);

      await service.register(registerDto);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: 'AGENT',
          }),
        }),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: mockUser.email,
      password: 'SecurePass123',
    };

    it('should login user successfully', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUserWithCompany);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue(mockJwtToken);

      const result = await service.login(loginDto);

      expect(result.access_token).toBe(mockJwtToken);
      expect(result.user).toHaveProperty('email', loginDto.email);
      expect(result.user).not.toHaveProperty('password');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUserWithCompany,
        isActive: false,
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if company is inactive', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUserWithCompany,
        company: { ...mockUserWithCompany.company, isActive: false },
      });

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUserWithCompany);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user without password if valid', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        mockUser.email,
        'SecurePass123',
      );

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(result?.email).toBe(mockUser.email);
    });

    it('should return null if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('invalid@example.com', 'pass');

      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(mockUser.email, 'wrongpass');

      expect(result).toBeNull();
    });
  });
});

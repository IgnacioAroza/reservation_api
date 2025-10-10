import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import {
  mockUser,
  mockUserWithCompany,
  mockUserWithoutPassword,
  mockCompany,
  createMockUser,
} from '../../test/mocks/data.mock';
import {
  getMockPrismaService,
  mockCompaniesService,
} from '../../test/mocks/services.mock';
import { Role } from '@prisma/client';

jest.mock('bcryptjs');

describe('UsersService', () => {
  let service: UsersService;
  let prisma: any;
  let companiesService: CompaniesService;

  beforeEach(async () => {
    const mockPrisma = getMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
    companiesService = module.get(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      email: 'newuser@example.com',
      password: 'SecurePass123',
      firstName: 'New',
      lastName: 'User',
      companyId: mockCompany.id,
      role: Role.AGENT,
    };

    it('should create a new user', async () => {
      const newUser = {
        ...mockUserWithCompany,
        email: createDto.email,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      mockCompaniesService.findOne.mockResolvedValue(mockCompany);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue(newUser);

      const result = await service.create(createDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(createDto.email);
      expect(companiesService.findOne).toHaveBeenCalledWith(
        createDto.companyId,
      );
    });

    it('should throw ConflictException if email exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if company not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      mockCompaniesService.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should default to AGENT role if not specified', async () => {
      const dtoWithoutRole = { ...createDto, role: undefined };

      prisma.user.findUnique.mockResolvedValue(null);
      mockCompaniesService.findOne.mockResolvedValue(mockCompany);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prisma.user.create.mockResolvedValue(mockUserWithCompany);

      await service.create(dtoWithoutRole);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: Role.AGENT,
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all active users', async () => {
      const users = [mockUserWithoutPassword];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        }),
      );
    });

    it('should filter by companyId when provided', async () => {
      const users = [mockUserWithoutPassword];
      prisma.user.findMany.mockResolvedValue(users);

      await service.findAll(mockCompany.id);

      expect(prisma.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            isActive: true,
            companyId: mockCompany.id,
          },
        }),
      );
    });

    it('should return empty array when no users found', async () => {
      prisma.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUserWithoutPassword);

      const result = await service.findOne(mockUser.id);

      expect(result).toEqual(mockUserWithoutPassword);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user is inactive', async () => {
      prisma.user.findUnique.mockResolvedValue({
        ...mockUserWithoutPassword,
        isActive: false,
      });

      await expect(service.findOne(mockUser.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return user with password when found', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUserWithCompany);

      const result = await service.findByEmail(mockUser.email);

      expect(result).toEqual(mockUserWithCompany);
      expect(result).toHaveProperty('password');
    });

    it('should return null if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateDto = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    it('should update a user', async () => {
      const updatedUser = { ...mockUserWithoutPassword, ...updateDto };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(mockUser.id, updateDto);

      expect(result).toEqual(updatedUser);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new email already exists', async () => {
      const updateWithEmail = { ...updateDto, email: 'existing@example.com' };
      const anotherUser = createMockUser({ id: 'another-id' });

      prisma.user.findUnique
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(anotherUser);

      await expect(
        service.update(mockUser.id, updateWithEmail),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow updating to same email', async () => {
      const updateWithSameEmail = {
        ...updateDto,
        email: mockUser.email,
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(mockUserWithoutPassword);

      await service.update(mockUser.id, updateWithSameEmail);

      expect(prisma.user.update).toHaveBeenCalled();
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
      prisma.user.update.mockResolvedValue(mockUser);

      const result = await service.updatePassword(mockUser.id, 'NewPass123');

      expect(result).toHaveProperty('message', 'Password updated successfully');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123', 10);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const deletedUser = { ...mockUserWithoutPassword, isActive: false };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.user.update.mockResolvedValue(deletedUser);

      const result = await service.remove(mockUser.id);

      expect(result.isActive).toBe(false);
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockUser.id },
          data: { isActive: false },
        }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

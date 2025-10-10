import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {
  mockUser,
  mockUserWithoutPassword,
  mockAdmin,
  mockCompany,
} from '../../test/mocks/data.mock';
import { mockUsersService } from '../../test/mocks/services.mock';
import { Role } from '@prisma/client';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user (ADMIN)', async () => {
      const createDto = {
        email: 'newuser@example.com',
        password: 'SecurePass123',
        firstName: 'New',
        lastName: 'User',
        companyId: mockCompany.id,
        role: Role.AGENT,
      };

      mockUsersService.create.mockResolvedValue(mockUserWithoutPassword);

      const result = await controller.create(createDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User created successfully');
      expect(result.data).toEqual(mockUserWithoutPassword);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all users for ADMIN', async () => {
      const users = [mockUserWithoutPassword];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll(mockAdmin.companyId, Role.ADMIN);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(users);
      expect(service.findAll).toHaveBeenCalledWith(undefined); // ADMIN sees all
    });

    it('should return filtered users for AGENT', async () => {
      const users = [mockUserWithoutPassword];
      mockUsersService.findAll.mockResolvedValue(users);

      const result = await controller.findAll(mockUser.companyId, Role.AGENT);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(users);
      expect(service.findAll).toHaveBeenCalledWith(mockUser.companyId);
    });
  });

  describe('findOne', () => {
    it('should return a user from same company', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUserWithoutPassword);

      const result = await controller.findOne(
        mockUser.id,
        mockUser.companyId,
        Role.AGENT,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUserWithoutPassword);
    });

    it('should allow ADMIN to view users from other companies', async () => {
      const otherCompanyUser = {
        ...mockUserWithoutPassword,
        companyId: 'other-company-id',
      };
      mockUsersService.findOne.mockResolvedValue(otherCompanyUser);

      const result = await controller.findOne(
        mockUser.id,
        mockAdmin.companyId,
        Role.ADMIN,
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(otherCompanyUser);
    });

    it('should throw ForbiddenException when viewing user from different company', async () => {
      const otherCompanyUser = {
        ...mockUserWithoutPassword,
        companyId: 'other-company-id',
      };
      mockUsersService.findOne.mockResolvedValue(otherCompanyUser);

      await expect(
        controller.findOne(mockUser.id, mockUser.companyId, Role.AGENT),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should update a user (ADMIN)', async () => {
      const updateDto = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      const updatedUser = { ...mockUserWithoutPassword, ...updateDto };
      mockUsersService.update.mockResolvedValue(updatedUser);

      const result = await controller.update(mockUser.id, updateDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User updated successfully');
      expect(result.data).toEqual(updatedUser);
      expect(service.update).toHaveBeenCalledWith(mockUser.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should soft delete a user (ADMIN)', async () => {
      const deletedUser = { ...mockUserWithoutPassword, isActive: false };
      mockUsersService.remove.mockResolvedValue(deletedUser);

      const result = await controller.remove(mockUser.id);

      expect(result.success).toBe(true);
      expect(result.message).toBe('User deleted successfully');
      expect(result.data).toEqual(deletedUser);
      expect(service.remove).toHaveBeenCalledWith(mockUser.id);
    });
  });
});

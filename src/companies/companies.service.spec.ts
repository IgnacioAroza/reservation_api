import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockCompany, mockCompanyWithCounts } from '../../test/mocks/data.mock';
import { getMockPrismaService } from '../../test/mocks/services.mock';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: any;

  beforeEach(async () => {
    const mockPrisma = getMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    describe('create', () => {
      it('should create a company with auto-generated slug', async () => {
        const createDto = { name: 'Test Company' };
        const expectedSlug = 'test-company';

        prisma.company.findFirst.mockResolvedValue(null);
        prisma.company.create.mockResolvedValue({
          ...mockCompany,
          name: createDto.name,
          slug: expectedSlug,
        });

        const result = await service.create(createDto);

        expect(result).toEqual({
          ...mockCompany,
          name: createDto.name,
          slug: expectedSlug,
        });
        expect(prisma.company.create).toHaveBeenCalledWith({
          data: {
            name: createDto.name,
            slug: expectedSlug,
          },
        });
      });

      it('should create a company with custom slug', async () => {
        const createDto = { name: 'Test Company', slug: 'custom-slug' };
        prisma.company.findFirst.mockResolvedValue(null);
        prisma.company.create.mockResolvedValue({
          ...mockCompany,
          slug: 'custom-slug',
        });

        const result = await service.create(createDto);

        expect(result.slug).toBe('custom-slug');
      });

      it('should generate slug from company name with accents', async () => {
        const createDto = { name: 'Compañía Española' };
        prisma.company.findFirst.mockResolvedValue(null);
        prisma.company.create.mockResolvedValue({
          ...mockCompany,
          name: createDto.name,
          slug: 'compania-espanola',
        });

        const result = await service.create(createDto);

        expect(result.slug).toBe('compania-espanola');
        expect(prisma.company.create).toHaveBeenCalledWith({
          data: {
            name: createDto.name,
            slug: 'compania-espanola',
          },
        });
      });

      it('should throw ConflictException when slug already exists', async () => {
        const createDto = { name: 'Test Company' };
        prisma.company.findFirst.mockResolvedValue(mockCompany);

        await expect(service.create(createDto)).rejects.toThrow(
          ConflictException,
        );
      });

      it('should handle accents and special characters in slug generation', async () => {
        const createDto = { name: 'Compañía Española' };
        prisma.company.findFirst.mockResolvedValue(null);
        prisma.company.create.mockResolvedValue({
          ...mockCompany,
          name: createDto.name,
          slug: 'compania-espanola',
        });

        const result = await service.create(createDto);

        expect(result.slug).toBe('compania-espanola');
      });
    });

    it('should create a company with custom slug', async () => {
      const createDto = { name: 'Test Company', slug: 'custom-slug' };

      prisma.company.findUnique.mockResolvedValue(null);
      prisma.company.create.mockResolvedValue({
        ...mockCompany,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result.slug).toBe('custom-slug');
    });

    it('should throw ConflictException if slug already exists', async () => {
      const createDto = { name: 'Test Company', slug: 'existing-slug' };

      prisma.company.findFirst.mockResolvedValue(mockCompany);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle accents and special characters in slug generation', async () => {
      const createDto = { name: 'Compañía Española' };
      const expectedSlug = 'compania-espanola';

      prisma.company.findUnique.mockResolvedValue(null);
      prisma.company.create.mockResolvedValue({
        ...mockCompany,
        name: createDto.name,
        slug: expectedSlug,
      });

      const result = await service.create(createDto);

      expect(result.slug).toBe(expectedSlug);
    });
  });

  describe('findAll', () => {
    it('should return all active companies', async () => {
      const companies = [mockCompanyWithCounts];
      prisma.company.findMany.mockResolvedValue(companies);

      const result = await service.findAll();

      expect(result).toEqual(companies);
      expect(prisma.company.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              users: true,
              properties: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no companies exist', async () => {
      prisma.company.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompanyWithCounts);

      const result = await service.findOne(mockCompany.id);

      expect(result).toEqual(mockCompanyWithCounts);
    });

    it('should throw NotFoundException if company not found', async () => {
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if company is inactive', async () => {
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(service.findOne(mockCompany.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findBySlug', () => {
    it('should return a company by slug', async () => {
      prisma.company.findFirst.mockResolvedValue(mockCompanyWithCounts);

      const result = await service.findBySlug(mockCompany.slug);

      expect(result).toEqual(mockCompanyWithCounts);
    });

    it('should return null if slug not found', async () => {
      prisma.company.findFirst.mockResolvedValue(null);

      const result = await service.findBySlug('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateDto = { name: 'Updated Company' };
      const updatedCompany = {
        ...mockCompany,
        name: updateDto.name,
        slug: 'updated-company',
      };

      prisma.company.findFirst
        .mockResolvedValueOnce(mockCompany)
        .mockResolvedValueOnce(null);
      prisma.company.update.mockResolvedValue(updatedCompany);

      const result = await service.update(mockCompany.id, updateDto);

      expect(result).toEqual(updatedCompany);
    });

    it('should update slug when name changes', async () => {
      const updateDto = { name: 'New Name' };
      const updatedCompany = {
        ...mockCompany,
        name: updateDto.name,
        slug: 'new-name',
      };

      prisma.company.findFirst
        .mockResolvedValueOnce(mockCompany)
        .mockResolvedValueOnce(null);
      prisma.company.update.mockResolvedValue(updatedCompany);

      const result = await service.update(mockCompany.id, updateDto);

      expect(result.slug).toBe('new-name');
    });

    it('should throw ConflictException if new slug already exists', async () => {
      const updateDto = { name: 'Another Company' };
      const anotherCompany = { ...mockCompany, id: 'another-id' };

      prisma.company.findFirst
        .mockResolvedValueOnce(mockCompany)
        .mockResolvedValueOnce(anotherCompany);

      await expect(service.update(mockCompany.id, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw NotFoundException if company not found', async () => {
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft delete a company', async () => {
      const deletedCompany = { ...mockCompany, isActive: false };

      prisma.company.findFirst.mockResolvedValue(mockCompany);
      prisma.company.update.mockResolvedValue(deletedCompany);

      const result = await service.remove(mockCompany.id);

      expect(result.isActive).toBe(false);
    });

    it('should throw NotFoundException if company not found', async () => {
      prisma.company.findFirst.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

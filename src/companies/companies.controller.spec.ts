import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { mockCompany, mockCompanyWithCounts } from '../../test/mocks/data.mock';
import { mockCompaniesService } from '../../test/mocks/services.mock';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: mockCompaniesService,
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createDto = { name: 'Test Company' };
      mockCompaniesService.create.mockResolvedValue(mockCompany);

      const result = await controller.create(createDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Company created successfully');
      expect(result.data).toEqual(mockCompany);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      const companies = [mockCompanyWithCounts];
      mockCompaniesService.findAll.mockResolvedValue(companies);

      const result = await controller.findAll();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(companies);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a company by id', async () => {
      mockCompaniesService.findOne.mockResolvedValue(mockCompanyWithCounts);

      const result = await controller.findOne(mockCompany.id);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCompanyWithCounts);
      expect(service.findOne).toHaveBeenCalledWith(mockCompany.id);
    });
  });

  describe('findBySlug', () => {
    it('should return a company by slug', async () => {
      mockCompaniesService.findBySlug.mockResolvedValue(mockCompanyWithCounts);

      const result = await controller.findBySlug(mockCompany.slug);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCompanyWithCounts);
      expect(service.findBySlug).toHaveBeenCalledWith(mockCompany.slug);
    });

    it('should return null when company not found', async () => {
      mockCompaniesService.findBySlug.mockResolvedValue(null);

      const result = await controller.findBySlug('non-existent');

      expect(result.data).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateDto = { name: 'Updated Company' };
      const updatedCompany = { ...mockCompany, ...updateDto };
      mockCompaniesService.update.mockResolvedValue(updatedCompany);

      const result = await controller.update(mockCompany.id, updateDto);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Company updated successfully');
      expect(result.data).toEqual(updatedCompany);
      expect(service.update).toHaveBeenCalledWith(mockCompany.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should soft delete a company', async () => {
      const deletedCompany = { ...mockCompany, isActive: false };
      mockCompaniesService.remove.mockResolvedValue(deletedCompany);

      const result = await controller.remove(mockCompany.id);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Company deleted successfully');
      expect(result.data).toEqual(deletedCompany);
      expect(service.remove).toHaveBeenCalledWith(mockCompany.id);
    });
  });
});

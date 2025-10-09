import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Public } from '../common/decorators/public.decorator';
import { successResponse } from '../common/interfaces/api-response.interface';

@Controller('companies')
@ApiTags('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Public() // ⚠️ Temporal para bootstrap - quitar después de implementar auth
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({
    status: 201,
    description: 'Company created successfully',
    schema: {
      example: {
        success: true,
        message: 'Company created successfully',
        data: {
          id: 'uuid-generated',
          name: 'Acme Corporation',
          slug: 'acme-corporation',
          createdAt: '2025-10-08T10:00:00.000Z',
          updatedAt: '2025-10-08T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Slug already exists',
    schema: {
      example: {
        success: false,
        message: 'Company with slug already exists: acme-corporation',
      },
    },
  })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this.companiesService.create(createCompanyDto);
    return successResponse(company, 'Company created successfully');
  }

  @Get()
  // @UseGuards(JwtAuthGuard, RolesGuard) // Después de implementar auth
  // @Roles(Role.ADMIN) // Solo admins pueden ver todas las compañías
  @ApiOperation({ summary: 'List all companies' })
  @ApiResponse({
    status: 200,
    description: 'Companies list retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'uuid-1',
            name: 'Acme Corporation',
            slug: 'acme-corporation',
            createdAt: '2025-10-08T10:00:00.000Z',
            updatedAt: '2025-10-08T10:00:00.000Z',
            _count: {
              users: 5,
              properties: 3,
            },
          },
        ],
      },
    },
  })
  @ApiBearerAuth()
  async findAll() {
    const companies = await this.companiesService.findAll();
    return successResponse(companies);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard) // Después de implementar auth
  @ApiOperation({ summary: 'Get a company by ID' })
  @ApiParam({
    name: 'id',
    description: 'Company ID (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Company found successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 'uuid-1',
          name: 'Acme Corporation',
          slug: 'acme-corporation',
          createdAt: '2025-10-08T10:00:00.000Z',
          updatedAt: '2025-10-08T10:00:00.000Z',
          _count: {
            users: 5,
            properties: 3,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
    schema: {
      example: {
        success: false,
        message: 'Company not found',
      },
    },
  })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.companiesService.findOne(id);
    return successResponse(company);
  }

  @Get('slug/:slug')
  // @UseGuards(JwtAuthGuard) // Después de implementar auth
  @ApiOperation({ summary: 'Get a company by slug' })
  @ApiParam({
    name: 'slug',
    description: 'Company slug',
    example: 'acme-corporation',
  })
  @ApiResponse({
    status: 200,
    description: 'Company found successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @ApiBearerAuth()
  async findBySlug(@Param('slug') slug: string) {
    const company = await this.companiesService.findBySlug(slug);
    if (!company) {
      return successResponse(null, 'Company not found');
    }
    return successResponse(company);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Después de implementar auth
  // @Roles(Role.ADMIN) // Solo admins pueden actualizar compañías
  @ApiOperation({ summary: 'Update a company' })
  @ApiParam({
    name: 'id',
    description: 'Company ID (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Company updated successfully',
    schema: {
      example: {
        success: true,
        message: 'Company updated successfully',
        data: {
          id: 'uuid-1',
          name: 'Acme Corporation Inc.',
          slug: 'acme-corporation-inc',
          createdAt: '2025-10-08T10:00:00.000Z',
          updatedAt: '2025-10-08T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Slug already exists',
  })
  @ApiBearerAuth()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const company = await this.companiesService.update(id, updateCompanyDto);
    return successResponse(company, 'Company updated successfully');
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Después de implementar auth
  // @Roles(Role.ADMIN) // Solo admins pueden eliminar compañías
  @ApiOperation({ summary: 'Soft delete a company' })
  @ApiParam({
    name: 'id',
    description: 'Company ID (UUID)',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Company deleted successfully (soft delete)',
    schema: {
      example: {
        success: true,
        message: 'Company deleted successfully',
        data: {
          id: 'uuid-1',
          name: 'Acme Corporation',
          slug: 'acme-corporation',
          isActive: false,
          createdAt: '2025-10-08T10:00:00.000Z',
          updatedAt: '2025-10-08T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Company not found',
  })
  @ApiBearerAuth()
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.companiesService.remove(id);
    return successResponse(company, 'Company deleted successfully');
  }
}

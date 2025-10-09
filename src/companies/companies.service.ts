import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const { name, slug } = createCompanyDto;

    // Generar slug si no se provee
    const finalSlug = slug || this.generateSlug(name);

    // Validar que el slug no exista
    await this.validateSlugUniqueness(finalSlug);

    // Crear la compañía
    const company = await this.prisma.company.create({
      data: {
        name,
        slug: finalSlug,
      },
    });

    return company;
  }

  async findAll() {
    const companies = await this.prisma.company.findMany({
      where: { isActive: true }, // Solo compañías activas
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            users: true,
            properties: true,
          },
        },
      },
    });

    return companies;
  }

  async findOne(id: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        isActive: true, // Solo compañías activas
      },
      include: {
        _count: {
          select: {
            users: true,
            properties: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async findBySlug(slug: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        slug,
        isActive: true, // Solo compañías activas
      },
    });

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    // Verificar que la compañía existe
    await this.findOne(id);

    const { name, slug } = updateCompanyDto;
    let finalSlug = slug;

    // Si se está actualizando el slug, validar unicidad
    if (slug) {
      await this.validateSlugUniqueness(slug, id);
    }

    // Si se actualiza el name pero no el slug, regenerar slug del nuevo nombre
    if (name && !slug) {
      finalSlug = this.generateSlug(name);
      await this.validateSlugUniqueness(finalSlug, id);
    }

    // Actualizar la compañía
    const company = await this.prisma.company.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(finalSlug && { slug: finalSlug }),
      },
    });

    return company;
  }

  async remove(id: string) {
    // Verificar que la compañía existe y está activa
    await this.findOne(id);

    // Soft delete: marcar como inactiva
    const company = await this.prisma.company.update({
      where: { id },
      data: { isActive: false },
    });

    return company;
  }

  /**
   * Genera un slug a partir de un string
   * Ejemplo: "Acme Corporation!" → "acme-corporation"
   */
  private generateSlug(text: string): string {
    return text
      .toLowerCase() // "Acme Corporation" → "acme corporation"
      .trim() // Eliminar espacios inicio/fin
      .normalize('NFD') // Normalizar acentos
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos: "José" → "Jose"
      .replace(/[^\w\s-]/g, '') // Eliminar caracteres especiales: "Corp!" → "Corp"
      .replace(/[\s_-]+/g, '-') // Espacios y guiones bajos → guiones: "acme corp" → "acme-corp"
      .replace(/^-+|-+$/g, ''); // Eliminar guiones inicio/fin: "-acme-" → "acme"
  }

  /**
   * Valida que un slug no exista en la base de datos
   * @param slug - El slug a validar
   * @param excludeId - ID a excluir de la búsqueda (para updates)
   */
  private async validateSlugUniqueness(
    slug: string,
    excludeId?: string,
  ): Promise<void> {
    const existingCompany = await this.prisma.company.findFirst({
      where: {
        slug,
        isActive: true, // Solo validar contra compañías activas
        ...(excludeId && { NOT: { id: excludeId } }),
      },
    });

    if (existingCompany) {
      throw new ConflictException(`Company with slug already exists: ${slug}`);
    }
  }
}

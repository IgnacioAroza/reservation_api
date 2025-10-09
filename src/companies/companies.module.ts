import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService], // 👈 Exportar para usar en AuthModule
})
export class CompaniesModule {}

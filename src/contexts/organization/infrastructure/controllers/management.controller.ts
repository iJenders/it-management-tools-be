import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateManagementUseCase } from '../../application/use-cases/create-management.use-case';
import type { ManagementRepository } from '../../domain/ports/management-repository.interface';

@Controller('managements')
export class ManagementController {
  constructor(
    private readonly createManagementUseCase: CreateManagementUseCase,
    @Inject('ManagementRepository')
    private readonly managementRepository: ManagementRepository,
  ) {}

  @Post()
  async create(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('managerId') managerId: string,
    @Body('costCenter') costCenter: string,
    @Body('organizationId') organizationId: string,
    @Body('parentManagementId') parentManagementId: string | null = null,
  ): Promise<any> {
    const management = await this.createManagementUseCase.execute(
      id,
      name,
      managerId,
      costCenter,
      organizationId,
      parentManagementId,
    );
    return {
      id: management.id,
      name: management.name.value,
      managerId: management.managerId,
      costCenter: management.costCenter.code,
      organizationId: management.organizationId,
      parentManagementId: management.parentManagementId,
    };
  }

  @Get()
  async findAll(): Promise<any[]> {
    const managements = await this.managementRepository.findAll();
    return managements.map((m) => ({
      id: m.id,
      name: m.name.value,
      managerId: m.managerId,
      costCenter: m.costCenter.code,
      organizationId: m.organizationId,
      parentManagementId: m.parentManagementId,
    }));
  }
}
